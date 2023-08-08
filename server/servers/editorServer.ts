import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import editorRouter from '../routes/editorRouter';

/* swagger */
import swaggerUi from 'swagger-ui-express';
const YAML = require('yamljs');
const swaggerDocs = YAML.load('../server/api-docs/swagger.yaml');

const app: Express = express();
const server = http.createServer(app);

/* swagger */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 로깅을 위한 미들웨어
const LoggerMiddleware = (req: Request, res: Response, next: any) => {
  console.log(`:::requestLog::: origin: ${req.headers.origin} host: ${
    req.headers.host
  } url: ${req.url} method: ${req.method} 
              -- ${new Date()}`);
  next();
};

app.use(LoggerMiddleware);
app.use(express.json());
app.use(cors());

app.use('/', editorRouter);

export default app;
