import express from 'express';

import { getSupportTicketsHandler } from './handler.js';

const router = express.Router();

router.get('/', getSupportTicketsHandler);

export { router as supportTicketRouter };
