import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import editorRouter from '../routes/editorRouter';
import pkg from 'body-parser';

const app: Express = express();
const server = http.createServer(app);
const { json } = pkg;

app.use(json());
app.use(cors());

app.use('/', editorRouter);

export default app;
