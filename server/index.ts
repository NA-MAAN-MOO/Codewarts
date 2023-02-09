import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Socket } from 'socket.io';

const app: Express = express();

//merge phaser 230209
const http = require('http'); // Load in http module
const httpServer = http.createServer(app);
const { Server } = require('socket.io'); // Load in socket.io
const io = new Server(httpServer); // initialize socket instance (passing httpserver)
let players: any[]; // Store a list of all the players

//환경변수 이용
dotenv.config();
const port = process.env.PORT;
const mongoPassword = process.env.MONGO_PW;

app.use(cors());
app.use(express.static('../client/build'));
app.use(express.json());

const db = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

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
    socket.broadcast.emit('playerDisconnect', socket.id);
    // players.forEach((player) => {
    //     if (player.socketId !== socket.id) {
    //         player.socket.emit("playerDisconnect", socket.id);
    //     }
    // });
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

  socket.on('movement', (xy) => {
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

httpServer.listen(port);
