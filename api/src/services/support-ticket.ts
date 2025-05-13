import { prisma } from '../client/prisma.js';
import {
  SupportTicketCreate,
  SupportTicketUpdate,
} from '../schemas/support-ticket.schema.js';

const getAllSupportTickets = async () => {
  const supportTickets = prisma.supportTicket.findMany();
  return supportTickets;
};

const getSupportTicketById = async (id: string) => {
  const maybeSupportTicket = prisma.supportTicket.findFirst({
    where: {
      id,
    },
  });

  return maybeSupportTicket;
};

const createSupportTicket = async (data: SupportTicketCreate) => {
  const createdSupportTicket = await prisma.supportTicket.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
    },
  });

  return createdSupportTicket;
};

const updateSupportTicketById = async (
  id: string,
  data: Omit<SupportTicketUpdate, 'id'>
) => {
  const supportTicket = await prisma.supportTicket.findFirst({ where: { id } });

  if (supportTicket) {
    const updatedSupportTicket = await prisma.supportTicket.update({
      data: {
        ...data,
      },
      where: {
        id,
      },
    });

    return updatedSupportTicket;
  } else {
    return null;
  }
};

const deleteSupportTicketById = async (id: string) => {
  const supportTicket = await prisma.supportTicket.findFirst({ where: { id } });

  if (supportTicket) {
    const deletedSupportTicket = await prisma.supportTicket.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    return deletedSupportTicket;
  } else {
    return null;
  }
};

export {
  createSupportTicket,
  deleteSupportTicketById,
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicketById,
};
