import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as params from './params';
import { GameEvent, ServerToClientEvents } from './events';
import { ClientToServerEvents, GameMessage } from './messages';
import { createUntimedEvent } from './utils';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: '*' },
});

let gameIdIndex = 0;

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
      console.log('client sent a join message!', msg);

      const gameId = `game-${gameIdIndex}`;
      await socket.join(gameId);
      console.log('rooms: ', socket.rooms);

      const sockets = await io.to(gameId).fetchSockets();

      socket.send(
        createUntimedEvent('joining', { gameId, playerId: socket.id })
      );
    })
);

httpServer.listen(3010, () => {
  console.log('Server started on port 3010');
});
