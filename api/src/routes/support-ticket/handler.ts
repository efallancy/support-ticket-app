import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  supportTicketCreateSchema,
  supportTicketSchema,
  supportTicketUpdateSchema,
} from '../../schemas/support-ticket.schema.js';
import { supportTicketService } from '../../services/index.js';

const getSupportTicketsHandler = async (_req: Request, res: Response) => {
  const supportTickets = await supportTicketService.getAllSupportTickets();

  res.json({
    data: supportTickets,
  });
};

const getSupportTicketByIdHandler = async (req: Request, res: Response) => {
  const reqParamsSchema = supportTicketSchema.pick({ id: true });
  const result = reqParamsSchema.safeParse(req.params);

  if (result.success) {
    const { id } = result.data;
    const supportTicket = await supportTicketService.getSupportTicketById(id);

    if (supportTicket) {
      res.json({
        data: supportTicket,
      });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ data: null });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request' });
  }
};

const createSupportTicketHandler = async (req: Request, res: Response) => {
  const result = supportTicketCreateSchema.safeParse(req.body);

  if (result.success) {
    const createdSupportTicket = await supportTicketService.createSupportTicket(
      result.data
    );

    res.json({ data: createdSupportTicket });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid request',
    });
  }
};

const updateSupportTicketByIdHandler = async (req: Request, res: Response) => {
  const paramsIdResult = supportTicketUpdateSchema
    .pick({ id: true })
    .safeParse(req.params);
  const bodyResult = supportTicketUpdateSchema
    .omit({ id: true })
    .safeParse(req.body);

  if (paramsIdResult.success && bodyResult.success) {
    const updatedSupportTicket =
      await supportTicketService.updateSupportTicketById(
        paramsIdResult.data.id,
        bodyResult.data
      );

    if (updatedSupportTicket) {
      res.json({ data: updatedSupportTicket });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid request',
    });
  }
};

const deleteSupportTicketByIdHandler = async (req: Request, res: Response) => {
  const paramsIdResult = supportTicketSchema
    .pick({ id: true })
    .safeParse(req.params);

  if (paramsIdResult.success) {
    const deletedSupportTicket =
      await supportTicketService.deleteSupportTicketById(
        paramsIdResult.data.id
      );

    if (deletedSupportTicket) {
      res.json({ data: deletedSupportTicket });
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid request',
    });
  }
};

const getSupportTicketSummaryAvailabilityHandler = async (
  req: Request,
  res: Response
) => {
  const isAvailable =
    supportTicketService.getSupportTicketSummaryAvailability();

  if (isAvailable) {
    res.json({ data: isAvailable });
  } else {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ message: 'Not available' });
  }
};

const getHighPrioritySupportTicketSummaryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const summary =
      await supportTicketService.getHighPrioritySupportTicketSummary();
    res.json({ data: summary });
  } catch (error) {
    req.log.error(`Unable to obtain summary: ${(error as Error).message}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Summary not available' });
  }
};

export {
  createSupportTicketHandler,
  deleteSupportTicketByIdHandler,
  getHighPrioritySupportTicketSummaryHandler,
  getSupportTicketByIdHandler,
  getSupportTicketsHandler,
  getSupportTicketSummaryAvailabilityHandler,
  updateSupportTicketByIdHandler,
};
