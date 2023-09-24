import axios from 'axios';
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

    .on('TEST_AI' as any, async (data: any) => {
      console.log('Got TEST_AI data', data);

      const baseUrl = "https://hack23-ai-ac11aa57a2eb.herokuapp.com/";
      const playerList = {"player_list": ["Miller", "Royce", "Alex", "Nick"]};
      const newSessionSuffix = "/new-session/ai-amount/1";
    
      // 1. start session, obtain session id
      const newSessionUrl = baseUrl + newSessionSuffix; // POST
      const sessionBody = playerList;
      const sessionResponse = await axios.post(newSessionUrl, sessionBody);
      console.log('response from ai', sessionResponse.data)

      // example log
      // response from ai {
      //   ai_players: [ 'billy' ],
      //   session_id: '79f89a3b-66b3-47d7-96c4-63352193cca0'
      // }

      const sessionID = sessionResponse.data.session_id;
      const aiName = sessionResponse.data.ai_players[0]; // use first result for testing

      // 2. assemble session and ai personalities
      const questionUrl = baseUrl + "/ai/" + aiName + "/session/" + sessionID;
      const question = "Are raiders fans violent thugs?";

      // 3. send question
      const questionResponse = await axios.post(questionUrl, question);

      // 4. return response to front end
      console.log('question response', questionResponse.data);
    })
);

httpServer.listen(3010, () => {
  console.log('Server started on port 3010');
});
