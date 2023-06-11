import dotenv from 'dotenv';
dotenv.config(); // 환경변수 이용(코드 최상단에 위치시킬 것)

import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import editorRouter from '../routes/editorRouter';

/* swagger */
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app: Express = express();
const server = http.createServer(app);
const EDITOR_URL = process.env.EDITOR_URL || 'http://localhost:3001';

/* swagger */
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.3', // 버전 명시 안해주면 example, request body 등의 필드가 나타나지 않음
    info: {
      title: 'CodeWarts API _ Editor',
      version: '1.0.0',
      contact: {
        name: 'CodeWarts API Support',
        url: 'https://github.com/NA-MAAN-MOO/Codewarts/issues',
      },
      servers: [
        {
          url: EDITOR_URL, // 에디터 서버
        },
      ],
    },
  },
  apis: ['./routes/*.ts'], // API가 있는 경로
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/editor-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());

app.use('/', editorRouter);

export default app;
