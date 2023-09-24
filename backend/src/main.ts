import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ServerToClientEvents } from './events';
import { GameSocket, startGame } from './game';
import { ClientToServerEvents } from './messages';
import * as params from './params';
import { createGameEvent } from './utils';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*' },
});

let gameIdIndex = 0;
const waitingSockets: GameSocket[] = [];

io.on('connection', socket =>
  socket
    .on('error', err => console.error('socket error', err))
    .on('disconnect', reason =>
      console.warn(`${socket.id} disconnected`, reason)
    )
    .on('disconnecting', reason =>
      console.warn(`${socket.id} is disconnecting`, reason)
    )
    .on('message', async msg => {
      if (msg.type !== 'join') return;
      console.log(
        `client sent a join message! there are ${waitingSockets.length} sockets waiting to begin`
      );

      const gameId = `game-${gameIdIndex}`;
      await socket.join(gameId);
      socket.send(createGameEvent('joining', { gameId, playerId: socket.id }));

      waitingSockets.push(socket);

      // If we're at quorum, create the game
      if (waitingSockets.length >= params.HUMAN_PLAYER_COUNT) {
        gameIdIndex++;
        startGame(gameId, io.to(gameId), waitingSockets);
        waitingSockets.splice(0, waitingSockets.length);
      }
    })
    // TODO: Remove after testing we can hit royce's api
    .on('TEST_AI' as any, async (data: any) => {
      console.warn('Got TEST_AI data', data);

      // TODO: @miller hit @royce's API successfully
    })
);

httpServer.listen(3010, () => {
  console.log('Server started on port 3010');
});
