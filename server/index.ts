import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { createClient } from 'redis';
import { v4 } from 'uuid';
import moment from 'moment';
import pkg from 'body-parser';
import chalk from 'chalk';
import mongoose from 'mongoose';

//환경변수 이용
dotenv.config();
const port = process.env.PORT;
const mongoPassword = process.env.MONGO_PW;

const app: Express = express();
const server = http.createServer(app);
const { json } = pkg;

const redisClient = createClient();
const hashField = 'code-mirror';

app.use(json());
app.use(cors());
app.use(express.static('../client/build'));

redisClient.on('error', console.error);

/* default client configuration */
redisClient
  .connect()
  .then(() => console.log(chalk.bold.blue('Connected to redis locally!')))
  .catch(() => {
    console.error(chalk.bold.red('Error connecting to redis'));
  });

// app.use(express.json());
const db = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send({ msg: "I'm alive" });
});

/* "방 만들기" 요청에 보내는 응답 */
app.post('/create-room', async (req, res) => {
  const { userName } = req.body;
  const roomId = v4(); // roomID 최초 생성

  await redisClient
    /* room 정보 해쉬로 저장 */
    .hSet(
      `${roomId}:info`,
      hashField,
      JSON.stringify({
        created: moment(),
        updated: moment(),
      })
    )
    .catch((err) => {
      console.error(1, err);
    });

  res.status(201).send({ roomId }); // return success & the room ID
});

// app.listen(port, () => {
//   console.log('server is running');
// });

/* 서버 포트: 3001 */
server.listen(3001, () => {
  console.log(chalk.bold.green('Server listening on *:3001'));
});
