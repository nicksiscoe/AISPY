import { BroadcastOperator, Socket } from 'socket.io';
import * as params from './params';
import { ServerToClientEvents } from './events';
import { ClientToServerEvents, GameMessage } from './messages';
import { PERSONAS } from './mocks';
import { GameState, Round, StateEvent, UserMessage } from './state';
import {
  createGameEvent,
  createStateEvent,
  pickN,
  pickOne,
  wait,
} from './utils';

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type GameBroadcaster = BroadcastOperator<ServerToClientEvents, {}>;

export interface Game {
  aiId: string;
  broadcaster: GameBroadcaster;
  sockets: GameSocket[];
  state: GameState;
}

type GameMessageWithSender = GameMessage & {
  id: number;
  senderId: string;
  sentAt: string;
};

const createGameState = (gameId: string, playerIds: string[]): GameState => ({
  latestEvent: createStateEvent('beginGame', 10000, {}),
  id: gameId,
  players: pickN(playerIds.length, PERSONAS)[0].map((p, i) => ({
    ...p,
    id: playerIds[i],
    status: 'active',
  })),
  rounds: [],
});

const emitStateAndWait = async (game: Game): Promise<Game> => {
  console.log(
    `emitting ${game.state.latestEvent.type} event state then waiting for ${game.state.latestEvent.duration} ms`
  );
  game.broadcaster.emit('message', createGameEvent('stateChange', game.state));
  await wait(game.state.latestEvent.duration);
  return game;
};

const waitForMessageFrom = async <
  T extends GameMessage['type'],
  M extends Extract<GameMessage, { type: T }>,
>(
  messageType: T,
  socket: GameSocket
): Promise<GameMessageWithSender> => {
  return new Promise<GameMessageWithSender>(ok => {
    console.log(`Waiting for a ${messageType} message from ${socket.id}`);
    socket.on('message', msg => {
      console.log(`Got a ${messageType} message from ${socket.id}`);
      if (msg.type === messageType) {
        ok({
          ...msg,
          id: Date.now(),
          senderId: socket.id,
          sentAt: new Date().toUTCString(),
        });
      }
    });
  });
};

const run = async (game: Game): Promise<Game> => {
  const { latestEvent } = game.state;
  switch (latestEvent.type) {
    // Begin game is handled a litte weirdly cuz it's the initialization event
    case 'beginGame': {
      await emitStateAndWait(game);
      const updatedGame = {
        ...game,
        state: updateState(game.state, 'beginRound'),
      };
      return run(await emitStateAndWait(updatedGame));
    }
    case 'beginRound': {
      const state = updateState(game.state, 'waitForQuestion');
      return emitStateAndWait({ ...game, state });
    }
    case 'waitForQuestion': {
      // latestEvent.askerId;
      const question = await waitForMessageFrom(
        'question',
        game.sockets.find(s => s.id === latestEvent.askerId)!
      );

      const state = applyMessageToState(game.state, question);
      return emitStateAndWait({ ...game, state });
    }
    default:
      return game;
  }
};

export const startGame = async (
  gameId: string,
  broadcaster: GameBroadcaster,
  sockets: GameSocket[]
) => {
  const aiId = 'ai';
  const state = createGameState(gameId, [...sockets.map(s => s.id), aiId]);
  await run({ aiId, broadcaster, sockets, state });
};

const applyMessageToState = (
  state: GameState,
  message: GameMessageWithSender
): GameState => {
  switch (message.type) {
    case 'question': {
      const currentRound = state.rounds[0];

      const userMessage: UserMessage = {
        ...message.data,
        askerId: message.senderId,
        messageId: message.id,
        messageType: 'question',
        questionId: message.id,
        sentAt: message.sentAt,
      };

      return {
        ...state,
        latestEvent: createStateEvent(
          'waitForAnswer',
          params.WAIT_FOR_ANSWER_DURATION,
          userMessage
        ),
        rounds: [
          {
            ...currentRound,
            messages: [userMessage, ...currentRound.messages],
          },
          ...state.rounds.slice(1),
        ],
      };
    }
    default: {
      throw new Error(`unhandled message type ${message.type}`);
    }
  }
};

const updateState = (
  state: GameState,
  nextEvent: Exclude<StateEvent['type'], 'beginGame'>
): GameState => {
  switch (nextEvent) {
    case 'beginRound':
      return {
        ...state,
        latestEvent: createStateEvent(
          'beginRound',
          params.BEGIN_ROUND_DURATION,
          {}
        ),
        rounds: [...state.rounds, { messages: [], phase: 'chat' }],
      };

    case 'waitForQuestion': {
      // Get the players that haven't asked anything yet
      const alreadyAsked = state.rounds[0].messages
        .filter(m => m.messageType === 'question')
        .map(m => m.askerId);

      const eligibleAskers = state.players.filter(
        p => !alreadyAsked.includes(p.id) && p.status !== 'eliminated'
      );

      return {
        ...state,
        latestEvent: createStateEvent(
          'waitForQuestion',
          params.WAIT_FOR_QUESTION_DURATION,
          { askerId: pickOne(eligibleAskers)[0].id }
        ),
      };
    }

    default: {
      throw new Error(`unhandled event type ${nextEvent}`);
    }
  }
};
