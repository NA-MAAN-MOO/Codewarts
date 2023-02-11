import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; // Load in http module
import pkg from 'body-parser';
import mongoose from 'mongoose';
import { Socket, Server } from 'socket.io'; // Load in socket.io
import editorServer from './servers/editorServer';
import basicRouter from './routes/basicRouter';

//환경변수 이용
dotenv.config();
const port = process.env.PORT || 8080;
const mongoPassword = process.env.MONGO_PW;
const { json } = pkg;

const app: Express = express();
app.use(json());
app.use(cors());

//빌드할 때 주석 해제
// app.use(express.static('../client/build'));
// app.get('/', function (req, res) {
//   res.sendFile('../client/build/index.html');
// });

//db connect
const db = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

//merge phaser 230209
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [`http://localhost:3000`],
    credentials: true,
  },
}); // initialize socket instance (passing ioServer)

app.use('/', basicRouter);

let players: any[] = []; // 모든 '접속 중' 유저들을 저장하는 리스트

io.on('connection', (socket: Socket) => {
  // socket이 연결됩니다~ 이 안에서 서버는 연결된 클라이언트와 소통할 준비가 됨
  console.log('a user connected'); // 유저와 소켓 연결 성공
  console.log(players.length); // '현재 접속을 시도한 유저'를 제외한 접속인원 수 ( 이하 '나' 라고 지칭하겠습니다. )
  const charKey = `char${Math.floor(Math.random() * 27)}`; // 랜덤으로 캐릭터 값을 지정해준다. 이후 캐릭터 선택하는 화면이 생기면, 그때 선택한 캐릭터 값을 charKey에 넣어주면 됨!
  let playerInfo = {
    // '나'의 데이터 값. soket 인스턴스, soket ID값, 캐릭터 값은 변하지 않는다.
    socket: socket,
    socketId: socket.id,
    charKey: charKey,
    state: 'resume',
    x: 0, // 좌표는 phaser에서 초기화되기 때문에 의미없는 0 값을 넣어뒀다.
    y: 0, // 왜 phaser에서 초기화 되는가? -> phaser의 맵 사이즈에 따라 좌표가 결정되기 때문에. ( 어차피 고정된 값이기 때문에 해당 좌표를 직접 찍어봐서 여기서 입력해도 문제는 없을것 같다. )
  };

  // Send back the payload to the client and set its initial position
  socket.emit('start', { socketID: socket.id, charKey: charKey }); // 연결된 유저에게 고유 데이터를 전달한다.

  // Send back the payload to the client and set its initial position
  socket.on('loadNewPlayer', (payLoad) => {
    // 위 playerInfo에서 초기화되지 않은 좌표값을 받아온 후 이미 접속중인 유저들에게 '나'의 데이터를 전달한다.
    console.log('loadNewPlayer');
    playerInfo.x = payLoad.x;
    playerInfo.y = payLoad.y;
    players.forEach((player) => {
      const payLoad = {
        // 다른 유저들에게 보낼 '나'의 데이터
        socketId: socket.id,
        state: playerInfo.state,
        charKey: playerInfo.charKey,
        x: playerInfo.x,
        y: playerInfo.y,
      };
      // 기존의 유저들에게 '나'의 데이터를 보낸다.
      player.socket.emit('newPlayer', payLoad);
    });
    players.push(playerInfo);
  });

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
  // 기존의 유저들을 새로온 유저에게 그려준다.
  socket.on('currentPlayers', () => {
    players.forEach((player) => {
      if (player.socketId !== socket.id) {
        const payLoad = {
          socketId: player.socketId,
          state: player.state,
          charKey: player.charKey,
          x: player.x,
          y: player.y,
        };
        console.log(payLoad.state);
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

  socket.on('connect_error', () => {
    console.log('error happened..');
  });

  socket.on('pauseCharacter', () => {
    playerInfo.state = 'paused';
    players.forEach((player) => {
      player.socket.emit('pauseCharacter', socket.id);
    });
  });

  socket.on('resumeCharacter', () => {
    playerInfo.state = 'resume';
    players.forEach((player) => {
      player.socket.emit('resumeCharacter', socket.id);
    });
  });
});

//8080 서버 연결
httpServer.listen(port, () => {
  console.log(`Server running on ${port}`);
});
/* 에디터 서버 포트: 3001 */
editorServer.listen(3001, () => {
  console.log('Server listening on *:3001');
});
