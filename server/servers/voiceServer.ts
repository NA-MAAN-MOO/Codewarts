import express from 'express';
import { json } from 'body-parser';
import http from 'http'; // Load in http module
import cors from 'cors';
import voiceRouter from '../routes/voiceRouter';

const app = express();

app.use(cors());
app.use(json());

const server = http.createServer(app);

app.use('/', voiceRouter);

export default server;
