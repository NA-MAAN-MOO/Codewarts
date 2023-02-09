import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // Load in http module
// import { createClient } from 'redis';
// import { v4 } from 'uuid';
// import moment from 'moment';
import pkg from 'body-parser';
// import chalk from 'chalk';
import mongoose from 'mongoose';
import { Socket, Server } from 'socket.io'; // Load in socket.io
import editorServer from './servers/editorServer';

//환경변수 이용
dotenv.config();
const port = process.env.PORT || 8080;
const mongoPassword = process.env.MONGO_PW;
const { json } = pkg;

const app: Express = express();
app.use(json());
app.use(cors());
app.use(express.static('../client/build'));

//merge phaser 230209
const httpServer = http.createServer(app);
const io = new Server(httpServer); // initialize socket instance (passing httpserver)
let players: any[]; // Store a list of all the players

//db connect
const db = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// app.listen(port, () => {
//   console.log('server is running');
// });

players = [];
//merge phaser 230209
io.on('connection', (socket: Socket) => {
  // socket이 연결됩니다~ 이 안에서 서버는 연결된 클라이언트와 소통할 준비가 됨
  console.log('a user connected');
  console.log(players.length);
  let playerInfo = {
    socket: socket,
    socketId: socket.id,
    x: 200,
    y: 200,
  };
  // The payload to be sent back to the client
  const payLoad = {
    socketId: socket.id,
    x: 200,
    y: 200,
  };
  // Send back the payload to the client and set its initial position
  socket.emit('start', payLoad);
  // Send back the payload to the client and set its initial position
  players.forEach((player) => {
    const payLoad = {
      socketId: socket.id,
      x: player.x,
      y: player.y,
    };
    player.socket.emit('newPlayer', payLoad);
  });

  players.push(playerInfo);

  socket.on('disconnect', () => {
    // socket이 연결 해제됩니다~
    console.log('user disconnected!!!');
    // socket.broadcast.emit('playerDisconnect', socket.id);
    players.forEach((player) => {
      if (player.socketId !== socket.id) {
        player.socket.emit('playerDisconnect', socket.id);
      }
    });
    players = players.filter((player) => player.socketId !== socket.id);
  });

  socket.on('currentPlayers', () => {
    players.forEach((player) => {
      if (player.socketId !== socket.id) {
        const payLoad = {
          socketId: player.socketId,
          x: player.x,
          y: player.y,
        };
        socket.emit('currentPlayers', payLoad);
      }
    });
  });

  socket.on('movement', (xy: { x: number; y: number; motion: string }) => {
    const payLoad = {
      socketId: socket.id,
      x: xy.x,
      y: xy.y,
      motion: xy.motion,
    };
    socket.broadcast.emit('updateLocation', payLoad);
    playerInfo.x = xy.x;
    playerInfo.y = xy.y;
  });
});

//8080 서버 연결
httpServer.listen(3000);

/* 에디터 서버 포트: 3001 */
editorServer.listen(3001, () => {
  console.log('Server listening on *:3001');
});
