import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', sock => {
  console.log('connection event', sock.id);
});

httpServer.listen(3001, () => {
  console.log('Server started on port 3001');
});
