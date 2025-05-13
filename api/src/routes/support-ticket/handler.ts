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

export {
  createSupportTicketHandler,
  deleteSupportTicketByIdHandler,
  getSupportTicketByIdHandler,
  getSupportTicketsHandler,
  updateSupportTicketByIdHandler,
};
