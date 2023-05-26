import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { createClient } from 'redis';
import editorRouter from '../routes/editorRouter';
import pkg from 'body-parser';

/* swagger */
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app: Express = express();
const server = http.createServer(app);
const { json } = pkg;
const redisClient = createClient();
const hashField = 'code-mirror';

/* swagger */
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Customer API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.ts'], // API가 있는 경로
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/* 미들웨어 설정(express 레퍼런스 참조) 
app.use('/')로 가기 전에 redisClient 설정 */
app.use((req, res, next) => {
  try {
    req.body.redisClient = redisClient;
    next(); // app.use('/')로 이동
  } catch (e) {
    console.log(e);
  }
});

app.use('/', editorRouter);

export default app;
