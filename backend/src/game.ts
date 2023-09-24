import { BroadcastOperator, Socket } from 'socket.io';
import { GameState } from './state';
import { ServerToClientEvents } from './events';
import { ClientToServerEvents } from './messages';
import { createEvent, pickN, wait } from './utils';
import { PERSONAS } from './mocks';

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type GameBroadcaster = BroadcastOperator<ServerToClientEvents, {}>;

export interface Game {
  aiId: string;
  broadcaster: GameBroadcaster;
  roomId: string;
  sockets: GameSocket[];
  state: GameState;
}

const createGameState = (gameId: string, playerIds: string[]): GameState => ({
  id: gameId,
  players: pickN(playerIds.length, PERSONAS)[0].map((p, i) => ({
    ...p,
    id: playerIds[i],
    status: 'active',
  })),
  rounds: [],
});
// //
export const startGame = async (
  gameId: string,
  broadcaster: GameBroadcaster,
  sockets: GameSocket[]
) => {
  const aiId = 'ai';
  const state = createGameState(gameId, [...sockets.map(s => s.id), aiId]);

  broadcaster.emit('message', createEvent('begin', 10, state));
  await wait(10);
  broadcaster.emit(
    'message',
    createEvent('beginRound', 3, {
      id: 0,
      currentPhase: {
        type: 'chat',
        messages: [],
      },
      previousPhases: [],
      status: 'ongoing',
    })
  );

  // return {
  //   aiId,
  //   broadcaster,
  //   roomId: gameId,
  //   sockets,
  //   state,
  // };
};
