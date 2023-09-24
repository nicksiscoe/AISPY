import axios from 'axios';
import { BroadcastOperator, Socket } from 'socket.io';
import { ServerToClientEvents } from './events';
import {
  Answer,
  ClientToServerEvents,
  GameMessage,
  Question,
} from './messages';
import { PERSONAS } from './mocks';
import * as params from './params';
import { GameState, Player, StateEvent, UserMessage } from './state';
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

type GameMessageMetadata = {
  id: number;
  senderId: string;
  sentAt: string;
};

const createGameState = (gameId: string, playerIds: string[]): GameState => ({
  latestEvent: createStateEvent('beginGame', params.BEGIN_GAME_DURATION, {}),
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
    `emitting ${game.state.latestEvent.type} event state then waiting for ${game.state.latestEvent.duration} ms`,
    game.state.latestEvent
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
): Promise<M & GameMessageMetadata> => {
  return new Promise<M & GameMessageMetadata>(ok => {
    console.log(`Waiting for a ${messageType} message from ${socket.id}`);
    socket.on('message', msg => {
      console.log(`Got a ${messageType} message from ${socket.id}`);
      if (msg.type === messageType) {
        ok({
          ...(msg as M),
          id: Date.now(),
          senderId: socket.id,
          sentAt: new Date().toUTCString(),
        });
      }
    });
  });
};

type VoteResults = {
  results: { [voterId: string]: string };
};

const collectVotes = async (
  game: Game
): Promise<VoteResults & GameMessageMetadata> => {
  const votes: VoteResults['results'] = {};
  return new Promise<VoteResults & GameMessageMetadata>(ok => {
    game.sockets.forEach(socket => {
      socket.on('message', msg => {
        console.log(`Got a vote from ${socket.id}`);
        if (msg.type === 'vote') {
          votes[socket.id] = msg.data.playerId;
        }
      });
    });

    setTimeout(
      () =>
        ok({
          // ...(msg as M),
          results: votes,
          id: Date.now(),
          senderId: '',
          sentAt: new Date().toUTCString(),
        }),
      params.WAIT_FOR_VOTES_DURATION
    );
  });
};

const getAnswerFromAi = async (
  game: Game,
  questionContents: string,
  questionId: number
): Promise<Answer & GameMessageMetadata> => {
  console.log('About to test for question to AI ... ');
  const baseUrl = 'https://hack23-ai-ac11aa57a2eb.herokuapp.com/';
  const playerList = {
    player_list: game.state.players
      .filter(p => p.id !== game.aiId)
      .map(p => p.name),
  };
  const newSessionSuffix = '/new-session/ai-amount/1';

  // 1. start session, obtain session id
  const newSessionUrl = baseUrl + newSessionSuffix; // POST
  const sessionBody = playerList;
  const sessionResponse = await axios.post(newSessionUrl, sessionBody);
  console.log('session response data:', sessionResponse.data);

  // example session start log
  // response from ai {
  //   ai_players: [ 'billy' ],
  //   session_id: '79f89a3b-66b3-47d7-96c4-63352193cca0'
  // }

  const sessionID = sessionResponse.data.session_id;
  const aiName = sessionResponse.data.ai_players[0]; // use first result for testing

  // 2. assemble question url
  const questionUrl = baseUrl + '/ai/' + aiName + '/session/' + sessionID;

  // 3. send question
  const questionResponse: {
    data: string[];
  } = await axios.post(questionUrl, questionContents);

  // 4. return response to front end
  console.log('question response', questionResponse.data);

  const AI_TEXT_RESPONSE = questionResponse.data.at(0);
  // TODO: @alex do something with AI_TEXT_RESPONSE, it is the legit AI response;

  console.log('AI_TEXT_RESPONSE: ', AI_TEXT_RESPONSE);
  return {
    data: {
      contents: questionResponse.data.at(0) ?? 'FUCK',
      questionId,
    },
    id: Date.now(),
    senderId: game.aiId,
    sentAt: new Date().toUTCString(),
    type: 'answer',
  };
};

const next = async (game: Game): Promise<Game> => {
  const { latestEvent } = game.state;
  console.log(`Run step ${latestEvent.type}`);

  if (game.sockets.some(s => s.disconnected)) {
    throw new Error('Stopping game because someone disconnected');
  }

  switch (latestEvent.type) {
    // Begin game is handled a litte weirdly cuz it's the initialization event
    case 'beginGame': {
      await emitStateAndWait(game);
      const updatedGame = {
        ...game,
        state: updateState(game.state, 'beginRound', null),
      };
      return next(await emitStateAndWait(updatedGame));
    }
    case 'beginRound': {
      const state = updateState(game.state, 'waitForQuestion', null);
      return next(await emitStateAndWait({ ...game, state }));
    }
    case 'waitForQuestion': {
      const question = await waitForMessageFrom(
        'question',
        game.sockets.find(s => s.id === latestEvent.askerId)!
      );

      const state = updateState(game.state, 'waitForAnswer', question);
      return next(await emitStateAndWait({ ...game, state }));
    }
    case 'waitForAnswer': {
      const answer = await (latestEvent.answererId === game.aiId
        ? getAnswerFromAi(game, latestEvent.contents, latestEvent.questionId)
        : waitForMessageFrom(
            'answer',
            game.sockets.find(s => s.id === latestEvent.answererId)!
          ));

      const state = updateState(game.state, 'nextQuestionOrVote', answer);
      return next(await emitStateAndWait({ ...game, state }));
    }
    case 'waitForVotes': {
      const votes = await collectVotes(game);
      const state = updateState(game.state, 'handleVoteResults', votes);
      return next(await emitStateAndWait({ ...game, state }));
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
  await next({ aiId, broadcaster, sockets, state });
};

function updateState<T extends StateEvent['type']>(
  state: GameState,
  nextEvent: T,
  maybeMessage: T extends 'waitForAnswer'
    ? Question & GameMessageMetadata
    : T extends 'nextQuestionOrVote'
    ? Answer & GameMessageMetadata
    : T extends 'handleVoteResults'
    ? VoteResults & GameMessageMetadata
    : null
): GameState {
  switch (nextEvent) {
    case 'beginGame':
      return state;

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

    case 'handleVoteResults': {
      const { ...votes } = maybeMessage! as VoteResults & GameMessageMetadata;
      const playerIds = Object.values(votes.results);
      const voteCounts = Object.fromEntries(
        Object.values(votes.results).map(id => [
          id,
          playerIds.filter(pid => pid === id).length,
        ])
      );

      const maxVotes = Math.max(...Object.values(voteCounts));

      const [loserId] = Object.entries(voteCounts).find(
        ([, count]) => count === maxVotes
      )!;

      const latestEvent =
        loserId === 'ai'
          ? createStateEvent('gameOver', 9999, { outcome: 'humansWin' })
          : createStateEvent('gameOver', 9999, { outcome: 'aiWins' });

      return {
        ...state,
        latestEvent,
        rounds: [
          {
            ...state.rounds[0],
            phase: 'ended',
          },
          ...state.rounds.slice(1),
        ],
      };
    }
    case 'nextQuestionOrVote': {
      const { ...answer } = maybeMessage! as Answer & GameMessageMetadata;
      const userMessage: UserMessage = {
        ...answer.data,
        answererId: answer.senderId,
        askerId: answer.senderId,
        messageId: answer.id,
        messageType: 'answer',
        questionId: answer.id,
        sentAt: answer.sentAt,
      };

      const eligibleAskers = getEligibleAskers(state);
      const isTimeToVote = eligibleAskers.length < 1;
      const latestEvent = isTimeToVote
        ? createStateEvent('waitForVotes', params.WAIT_FOR_VOTES_DURATION, {})
        : createStateEvent(
            'waitForQuestion',
            params.WAIT_FOR_QUESTION_DURATION,
            { askerId: pickOne(eligibleAskers)[0].id }
          );

      return {
        ...state,
        latestEvent,
        rounds: [
          {
            ...state.rounds[0],
            messages: [userMessage, ...state.rounds[0].messages],
            phase: isTimeToVote ? 'vote' : 'chat',
          },
          ...state.rounds.slice(1),
        ],
      };
    }

    case 'waitForAnswer': {
      const currentRound = state.rounds[0];
      const { ...question } = maybeMessage! as Question & GameMessageMetadata;
      const userMessage: UserMessage = {
        ...question.data,
        askerId: question.senderId,
        messageId: question.id,
        messageType: 'question',
        questionId: question.id,
        sentAt: question.sentAt,
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

    case 'waitForQuestion': {
      const eligibleAskers = getEligibleAskers(state);

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
}

const getEligibleAskers = (state: GameState): Player[] => {
  const alreadyAsked = state.rounds[0].messages
    .filter(m => m.messageType === 'question')
    .map(m => m.askerId);

  return state.players.filter(
    p =>
      !alreadyAsked.includes(p.id) && p.status !== 'eliminated' && p.id !== 'ai'
  );
};
