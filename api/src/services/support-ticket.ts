import { openai } from '../client/openai.js';
import { prisma } from '../client/prisma.js';
import { config } from '../config.js';
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

const getSupportTicketSummaryAvailability = () => {
  // Consider summary feature is available when OpenAI API key is provided
  return config.openai.apiKey ? true : false;
};

const getHighPrioritySupportTicketSummary = async () => {
  const isAvailable = getSupportTicketSummaryAvailability();

  if (!isAvailable) {
    throw new Error('Summary feature is not available');
  }

  const supportTickets = await prisma.supportTicket.findMany({
    where: {
      priority: 'HIGH',
      OR: [
        {
          status: 'OPEN',
        },
        {
          status: 'IN_PROGRESS',
        },
      ],
    },
  });

  if (supportTickets.length > 0) {
    const summary = await openai.responses.create({
      model: 'o4-mini',
      instructions: 'You are an expert in triaging support tickets',
      input: [
        `Summarize the following support tickets and provide actionable suggestion:`,
        '\n',
        ...supportTickets.map(
          (supportTicket) =>
            `Title: ${supportTicket.description}\nDescription: ${supportTicket.description}\n`
        ),
      ].join('\n'),
    });

    return summary.output_text;
  } else {
    return 'No immediate support ticket that requires attention';
  }
};

export {
  createSupportTicket,
  deleteSupportTicketById,
  getAllSupportTickets,
  getHighPrioritySupportTicketSummary,
  getSupportTicketById,
  getSupportTicketSummaryAvailability,
  updateSupportTicketById,
};
