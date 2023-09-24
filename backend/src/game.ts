import { Socket } from 'socket.io';
import { GameState } from './state';
import { ServerToClientEvents } from './events';
import { ClientToServerEvents } from './messages';

export interface Game {
  aiId: string;
  sockets: Socket<ClientToServerEvents, ServerToClientEvents>;
  state: GameState;
}

// //
export const createGame = (gameId: string, playerIds: string[]): GameState => {
  return {
    id: gameId,
    players: [],
    rounds: [],
  };
};
