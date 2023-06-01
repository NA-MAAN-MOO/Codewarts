import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import editorRouter from '../routes/editorRouter';

/* swagger */
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app: Express = express();
const server = http.createServer(app);

/* swagger */
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'CodeWarts API _ Editor',
      version: '1.0.0',
      contact: {
        name: 'CodeWarts API Support',
        url: 'https://github.com/NA-MAAN-MOO/Codewarts/issues',
      },
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
