import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { openai } from '../client/openai.js';
import { prisma } from '../client/prisma.js';
import {
  SupportTicket,
  SupportTicketCreate,
  SupportTicketUpdate,
} from '../schemas/support-ticket.schema.js';
import {
  createSupportTicket,
  deleteSupportTicketById,
  getAllSupportTickets,
  getHighPrioritySupportTicketSummary,
  getSupportTicketById,
  getSupportTicketSummaryAvailability,
  updateSupportTicketById,
} from './support-ticket.js';

vi.mock('../client/prisma.js', () => ({
  prisma: {
    supportTicket: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('../client/openai.js', () => ({
  openai: {
    responses: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../config.js', () => ({
  config: {
    openai: {
      apiKey: 'test-api-key',
    },
  },
}));

describe('supportTicketService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getAllSupportTickets', () => {
    it('should return all support tickets', async () => {
      const createdAt = new Date();
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          title: 'Test Ticket',
          description: 'Test Description',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: createdAt.toISOString(),
        },
      ];
      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue(
        mockTickets.map((ticket) => ({ ...ticket, createdAt }))
      );

      const result = await getAllSupportTickets();

      expect(prisma.supportTicket.findMany).toHaveBeenCalledTimes(1);
      expect(result.length).toEqual(mockTickets.length);
      expect(result.map((ticket) => ticket.id)).toEqual(
        mockTickets.map((ticket) => ticket.id)
      );
    });
  });

  describe('getSupportTicketById', () => {
    it('should return a support ticket by id', async () => {
      const createdAt = new Date();
      const mockTicket: SupportTicket = {
        id: '1',
        title: 'Test Ticket',
        description: 'Test Description',
        priority: 'HIGH',
        status: 'OPEN',
        createdAt: createdAt.toISOString(),
      };
      vi.mocked(prisma.supportTicket.findFirst).mockResolvedValue({
        ...mockTicket,
        createdAt,
      });

      const result = await getSupportTicketById('1');

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.findFirst).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(
        expect.objectContaining({
          ...mockTicket,
          createdAt: expect.any(Date),
        })
      );
    });

    it('should return null when ticket is not found', async () => {
      vi.mocked(prisma.supportTicket.findFirst).mockResolvedValue(null);

      const result = await getSupportTicketById('999');

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('createSupportTicket', () => {
    it('should create a new support ticket', async () => {
      const createdAt = new Date();
      const ticketData: SupportTicketCreate = {
        title: 'New Ticket',
        description: 'New Description',
        priority: 'MEDIUM',
      };
      const mockCreatedTicket: SupportTicket = {
        id: '1',
        title: 'New Ticket',
        description: 'New Description',
        priority: 'MEDIUM',
        status: 'OPEN',
        createdAt: createdAt.toISOString(),
      };
      vi.mocked(prisma.supportTicket.create).mockResolvedValue({
        ...mockCreatedTicket,
        createdAt,
      });

      const result = await createSupportTicket(ticketData);

      expect(prisma.supportTicket.create).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.create).toHaveBeenCalledWith({
        data: {
          title: ticketData.title,
          description: ticketData.description,
          priority: ticketData.priority,
        },
      });
      expect(result).toEqual(
        expect.objectContaining({
          ...mockCreatedTicket,
          createdAt: expect.any(Date),
        })
      );
    });
  });

  describe('updateSupportTicketById', () => {
    it('should update a support ticket when it exists', async () => {
      const createdAt = new Date();
      const existingTicket: SupportTicket = {
        id: '1',
        title: 'Existing Ticket',
        description: 'Existing Description',
        priority: 'LOW',
        status: 'OPEN',
        createdAt: createdAt.toISOString(),
      };
      const updateData: SupportTicketUpdate = {
        id: '1',
        status: 'IN_PROGRESS',
      };
      const updatedTicket: SupportTicket = {
        ...existingTicket,
        status: 'IN_PROGRESS',
      };

      vi.mocked(prisma.supportTicket.findFirst).mockResolvedValue({
        ...existingTicket,
        createdAt,
      });
      vi.mocked(prisma.supportTicket.update).mockResolvedValue({
        ...updatedTicket,
        createdAt,
      });

      const result = await updateSupportTicketById('1', updateData);

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.update).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.update).toHaveBeenCalledWith({
        data: updateData,
        where: { id: '1' },
      });
      expect(result).toEqual(
        expect.objectContaining({ status: 'IN_PROGRESS' })
      );
    });

    it('should return null when trying to update a non-existent ticket', async () => {
      const updateData: SupportTicketUpdate = {
        id: '999',
        status: 'IN_PROGRESS',
      };

      vi.mocked(prisma.supportTicket.findFirst).mockResolvedValue(null);

      const result = await updateSupportTicketById('999', updateData);

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('deleteSupportTicketById', () => {
    it('should delete a support ticket when it exists', async () => {
      const createdAt = new Date();
      const existingTicket: SupportTicket = {
        id: '1',
        title: 'Existing Ticket',
        description: 'Existing Description',
        priority: 'LOW',
        status: 'OPEN',
        createdAt: createdAt.toISOString(),
      };
      const deletedTicket = {
        id: '1',
      } as SupportTicket;

      vi.mocked(prisma.supportTicket.findFirst).mockResolvedValue({
        ...existingTicket,
        createdAt,
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      vi.mocked(prisma.supportTicket.delete).mockResolvedValue(deletedTicket);

      const result = await deleteSupportTicketById('1');

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.delete).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { id: true },
      });
      expect(result).toEqual(deletedTicket);
    });

    it('should return null when trying to delete a non-existent ticket', async () => {
      vi.mocked(prisma.supportTicket.findFirst).mockResolvedValue(null);

      const result = await deleteSupportTicketById('999');

      expect(prisma.supportTicket.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.supportTicket.delete).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('getSupportTicketSummaryAvailability', () => {
    it('should return true when OpenAI API key is available', () => {
      const result = getSupportTicketSummaryAvailability();
      expect(result).toBe(true);
    });
  });

  describe('getHighPrioritySupportTicketSummary', () => {
    it('should return a summary when high priority tickets exist', async () => {
      const createdAt = new Date();
      const highPriorityTickets: SupportTicket[] = [
        {
          id: '1',
          title: 'Urgent Issue',
          description: 'System is down',
          priority: 'HIGH',
          status: 'OPEN',
          createdAt: createdAt.toISOString(),
        },
      ];
      const mockSummary = {
        output_text: 'There is an urgent issue that needs attention.',
      };

      vi.mocked(prisma.supportTicket.findMany).mockResolvedValue(
        highPriorityTickets.map((ticket) => ({ ...ticket, createdAt }))
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      vi.mocked(openai.responses.create).mockResolvedValue(mockSummary);

      const result = await getHighPrioritySupportTicketSummary();

      expect(prisma.supportTicket.findMany).toHaveBeenCalledWith({
        where: {
          priority: 'HIGH',
          OR: [{ status: 'OPEN' }, { status: 'IN_PROGRESS' }],
        },
      });
      expect(openai.responses.create).toHaveBeenCalled();
      expect(result).toBe(mockSummary.output_text);
    });
  });
});
