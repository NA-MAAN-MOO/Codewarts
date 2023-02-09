import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
// import { createClient } from 'redis';
// import { v4 } from 'uuid';
// import moment from 'moment';
import pkg from 'body-parser';
import chalk from 'chalk';
import mongoose from 'mongoose';
import editorServer from './servers/editorServer';

//환경변수 이용
dotenv.config();
const port = process.env.PORT || 8080;
const mongoPassword = process.env.MONGO_PW;

const app: Express = express();
const server = http.createServer(app);

const { json } = pkg;

app.use(json());
app.use(cors());
app.use(express.static('../client/build'));

//db connect
const db = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log('server is running');
});

/* 에디터 서버 포트: 3001 */
editorServer.listen(3001, () => {
  console.log(chalk.bold.green('Server listening on *:3001'));
});
