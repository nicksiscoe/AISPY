import { BroadcastOperator, Socket } from 'socket.io';
import { GameState, StateEvent } from './state';
import { GameEvent, ServerToClientEvents } from './events';
import { ClientToServerEvents } from './messages';
import { createGameEvent, createStateEvent, pickN, wait } from './utils';
import { PERSONAS } from './mocks';

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
  // await wait(game.state.latestEvent)
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

  await run('beginGame', {
    aiId,
    broadcaster,
    sockets,
    state,
  });

  // const begin = createEvent('begin', 10, state);
  // broadcaster.emit('message', begin);
  // await wait(10);

  // const beginRound = createStateEvent('beginRound', 3, {
  //   id: 0,
  //   currentPhase: {
  //     type: 'chat',
  //     messages: [],
  //   },
  //   previousPhases: [],
  //   status: 'ongoing',
  // });

  // broadcaster.emit('message', beginRound);
};
