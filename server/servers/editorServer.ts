import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import editorRouter from '../routes/editorRouter';

const app: Express = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use('/', editorRouter);

export default app;
