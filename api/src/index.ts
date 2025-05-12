import { pino } from 'pino';

import { setupServer } from './app.js';
import { config } from './config.js';

const logger = pino({
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

const app = setupServer(logger);

const server = app.listen(config.server.port, () => {
  logger.info(`Server is listening on port ${config.server.port}`);
});

process.on('SIGINT', () => {
  logger.warn('Receiving SIGINT signal. Shutting down server!');
  server.close();
});

process.on('SIGTERM', () => {
  logger.warn('Receiving SIGTERM signal. Shutting down server!');
  server.close();
});
