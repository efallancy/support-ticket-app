import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';

import { registerErrorMiddleware } from './middlewares/error.js';
import { registerRoutes } from './routes/index.js';

const setupServer = (logger: Logger): Express => {
  const httpLogger = pinoHttp({
    logger,
  });

  const app = express();

  app.use(httpLogger);
  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  registerRoutes(app);
  registerErrorMiddleware(app);

  return app;
};

export { setupServer };
