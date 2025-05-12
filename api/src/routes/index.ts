import type { Express } from 'express';

import { supportTicketRouter } from './support-ticket/index.js';

const registerRoutes = (app: Express) => {
  app.use('/support-tickets', supportTicketRouter);
};

export { registerRoutes };
