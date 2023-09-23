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

io.on('connection', socket => {
  console.log('connection event', socket.id);
  socket.onAny((event, ...args) => {
    console.log(`got event ${event}`);
  });
  socket
    .on('error', err => console.error('socket error', err))
    .on('disconnect', reason =>
      console.warn(`${socket.id} disconnected`, reason)
    )
    .on('disconnecting', reason =>
      console.warn(`${socket.id} is disconnecting`, reason)
    )
    .on('message', msg => console.log('client sent a message!', msg));

  setTimeout(
    () =>
      socket.send({
        id: `${Date.now()}`,
        data: { playerId: socket.id },
        ends: null,
        type: 'joining',
      }),
    500
  );
});

httpServer.listen(3001, () => {
  console.log('Server started on port 3001');
});
