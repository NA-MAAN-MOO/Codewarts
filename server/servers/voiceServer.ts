import express from 'express';
import { json } from 'body-parser';
import http from 'http'; // Load in http module
import cors from 'cors';
import voiceRouter from '../routes/voiceRouter';

const app = express();

const SERVER_URL = `${process.env.SERVER_URL}` || 'http://localhost:3000';

app.use(cors({ credentials: true, origin: `${SERVER_URL}` }));
app.use(json());

const server = http.createServer(app);

app.use('/', voiceRouter);

export default server;
