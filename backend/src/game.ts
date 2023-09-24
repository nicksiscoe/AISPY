import { BroadcastOperator, Socket } from 'socket.io';
import * as params from './params';
import { ServerToClientEvents } from './events';
import { ClientToServerEvents } from './messages';
import { PERSONAS } from './mocks';
import { GameState, Round, StateEvent } from './state';
import { createGameEvent, createStateEvent, pickN, wait } from './utils';

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type GameBroadcaster = BroadcastOperator<ServerToClientEvents, {}>;

export interface Game {
  aiId: string;
  broadcaster: GameBroadcaster;
  sockets: GameSocket[];
  state: GameState;
}

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

const run = async (game: Game): Promise<Game> => {
  switch (game.state.latestEvent.type) {
    // Begin game is handled a litte weirdly cuz it's the initialization event
    case 'beginGame':
      await emitStateAndWait(game);
      const updatedGame = {
        ...game,
        state: updateState(game.state, 'beginRound'),
      };
      return emitStateAndWait(updatedGame);
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

  // broadcaster.emit('message', beginRound);
};

const updateState = (
  state: GameState,
  nextEvent: Exclude<StateEvent['type'], 'beginGame'>
): GameState => {
  switch (nextEvent) {
    case 'beginRound': {
      const newRound: Round = {
        index: state.rounds.length,
        currentPhase: { type: 'chat', messages: [] },
        previousPhases: [],
        status: 'ongoing',
      };

      return {
        ...state,
        latestEvent: createStateEvent(
          'beginRound',
          params.BEGIN_ROUND_DURATION,
          { index: state.rounds.length }
        ),
        rounds: [...state.rounds, newRound],
      };
    }

    default:
      return state;
  }
};
