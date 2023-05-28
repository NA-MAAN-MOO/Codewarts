import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
// import editorRouter from '../routes/editorRouter';
import userRouter from '../routes/userRouter';
import whiteboardRouter from '../routes/whiteboardRouter';

const app: Express = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/', whiteboardRouter);

export default app;
