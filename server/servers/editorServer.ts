import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import editorRouter from '../routes/editorRouter';

/* swagger */
import swaggerUi from 'swagger-ui-express';
const YAML = require('yamljs');
const swaggerDocs = YAML.load('../api-docs/swagger.yaml');

const app: Express = express();
const server = http.createServer(app);
const EDITOR_URL = process.env.EDITOR_URL || 'http://localhost:3001';

/* swagger */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());

app.use('/', editorRouter);

export default app;
