import { Socket } from 'socket.io';
import { GameState } from './state';
import { ServerToClientEvents } from './events';
import { ClientToServerEvents } from './messages';
import { pickN } from './utils';
import { PERSONAS } from './mocks';

export type GameSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export interface Game {
  aiId: string;
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
export const createGame = (gameId: string, sockets: GameSocket[]): Game => {
  const aiId = 'ai';

  return {
    aiId: 'ai',
    roomId: gameId,
    sockets,
    state: createGameState(gameId, [...sockets.map(s => s.id), aiId]),
  };
};
