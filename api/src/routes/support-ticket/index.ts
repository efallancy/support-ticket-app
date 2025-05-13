import express from 'express';

import {
  createSupportTicketHandler,
  deleteSupportTicketByIdHandler,
  getSupportTicketByIdHandler,
  getSupportTicketsHandler,
  updateSupportTicketByIdHandler,
} from './handler.js';

const router = express.Router();

router.get('/', getSupportTicketsHandler);
router.get('/:id', getSupportTicketByIdHandler);
router.post('/', createSupportTicketHandler);
router.put('/:id', updateSupportTicketByIdHandler);
router.delete('/:id', deleteSupportTicketByIdHandler);

export { router as supportTicketRouter };
