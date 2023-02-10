import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { createClient } from 'redis';
// import chalk from 'chalk';
import editorRouter from '../routes/editorRouter';
import pkg from 'body-parser';

const app: Express = express();
const server = http.createServer(app);
const { json } = pkg;
const redisClient = createClient();
const hashField = 'code-mirror';

app.use(json());
app.use(cors());

redisClient.on('error', console.error);

/* default client configuration */
redisClient
  .connect()
  .then(() => console.log('Connected to redis locally!'))
  .catch(() => {
    console.error('Error connecting to redis');
  });

app.use((req, res, next) => {
  try {
    req.body.redisClient = redisClient;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use('/', editorRouter);

export default app;
