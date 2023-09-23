import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GameEvent } from './events';
import { GameMessage } from './messages';

const app = express();
const httpServer = createServer(app);
const io = new Server<
  { message: (msg: GameMessage) => void },
  { message: (e: GameEvent, ack?: (e: number) => void) => void }
>(httpServer, { cors: { origin: '*' } });

let gameIdIndex = 0;

io.on('connection', socket => {
  console.log('connection event', socket.id);

  // socket.onAny((event, ...args) => {
  //   console.log(`got event ${event}`);
  // });

  socket
    .on('error', err => console.error('socket error', err))
    .on('disconnect', reason =>
      console.warn(`${socket.id} disconnected`, reason)
    )
    .on('disconnecting', reason =>
      console.warn(`${socket.id} is disconnecting`, reason)
    )
    .on('message', async msg => {
      console.log('client sent a message!', msg);
      if (msg.type === 'join') {
        const gameId = `game-${gameIdIndex}`;
        await socket.join(gameId);
        socket.send({
          id: `${Date.now()}`,
          data: { gameId, playerId: socket.id },
          ends: null,
          type: 'joining',
        });
      }
    });

  // setTimeout(
  //   () =>
  //     socket.send({
  //       id: `${Date.now()}`,
  //       data: { playerId: socket.id },
  //       ends: null,
  //       type: 'joining',
  //     }),
  //   500
  // );
});

httpServer.listen(3010, () => {
  console.log('Server started on port 3010');
});
