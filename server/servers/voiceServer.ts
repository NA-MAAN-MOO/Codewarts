import express from 'express';
import { json } from 'body-parser';
import http from 'http'; // Load in http module
import cors from 'cors';
import voiceRouter from '../routes/voiceRouter';
import { CONFIG } from '../constants/index';

const app = express();

const SERVER_URL = CONFIG.SERVER_URL;

app.use(cors({ credentials: true, origin: `${SERVER_URL}` }));
app.use(json());

const server = http.createServer(app);

app.use('/', voiceRouter);

export default server;
