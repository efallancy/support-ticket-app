import express from 'express';

import {
  createSupportTicketHandler,
  deleteSupportTicketByIdHandler,
  getHighPrioritySupportTicketSummaryHandler,
  getSupportTicketByIdHandler,
  getSupportTicketsHandler,
  getSupportTicketSummaryAvailabilityHandler,
  updateSupportTicketByIdHandler,
} from './handler.js';

const router = express.Router();

router.get('/', getSupportTicketsHandler);
router.get('/summary-available', getSupportTicketSummaryAvailabilityHandler);
router.get('/summary', getHighPrioritySupportTicketSummaryHandler);
router.get('/:id', getSupportTicketByIdHandler);
router.post('/', createSupportTicketHandler);
router.put('/:id', updateSupportTicketByIdHandler);
router.delete('/:id', deleteSupportTicketByIdHandler);

export { router as supportTicketRouter };
