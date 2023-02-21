import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
// import editorRouter from '../routes/editorRouter';
import pkg from 'body-parser';
import userRouter from '../routes/userRouter';

const app: Express = express();
const server = http.createServer(app);
const { json } = pkg;

app.use(json());
app.use(cors());

app.use('/user', userRouter);

export default app;
