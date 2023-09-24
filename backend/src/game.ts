import { BroadcastOperator, Socket } from 'socket.io';
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
  game.broadcaster.emit('message', createGameEvent('stateChange', game.state));
  await wait(game.state.latestEvent.duration);
  return game;
};

const run = async (
  nextEvent: StateEvent['type'],
  game: Game
): Promise<Game> => {
  switch (nextEvent) {
    case 'beginGame':
      return emitStateAndWait(game);
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
  await run('beginGame', { aiId, broadcaster, sockets, state });

  // broadcaster.emit('message', beginRound);
};

const updateState = (
  state: GameState,
  nextEvent: Exclude<StateEvent['type'], 'beginGame'>
): GameState => {
  switch (nextEvent) {
    case 'beginRound': {
      const newRound: Round = {
        id: state.rounds.length,
        currentPhase: {
          type: 'chat',
          messages: [],
        },
        previousPhases: [],
        status: 'ongoing',
      };
      // const beginRound = createStateEvent('beginRound', 3, {
      //   id: 0,
      // });

      return { ...state };
    }

    default:
      return state;
  }
};
