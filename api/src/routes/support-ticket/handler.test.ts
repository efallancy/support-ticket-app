import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type Logger } from 'pino';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SupportTicket } from '../../schemas/support-ticket.schema.js';
import { supportTicketService } from '../../services/index.js';
import {
  createSupportTicketHandler,
  deleteSupportTicketByIdHandler,
  getHighPrioritySupportTicketSummaryHandler,
  getSupportTicketsHandler,
  getSupportTicketSummaryAvailabilityHandler,
  updateSupportTicketByIdHandler,
} from './handler.js';

vi.mock('../../services/index.js', () => ({
  supportTicketService: {
    createSupportTicket: vi.fn(),
    deleteSupportTicketById: vi.fn(),
    updateSupportTicketById: vi.fn(),
    getSupportTicketSummaryAvailability: vi.fn(),
    getHighPrioritySupportTicketSummary: vi.fn(),
    getAllSupportTickets: vi.fn(),
  },
}));

describe('getSupportTicketsHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it('should return 200 with a list of available support tickets', async () => {
    vi.mocked(supportTicketService.getAllSupportTickets).mockResolvedValue([
      {
        id: 'support-1',
        createdAt: new Date(),
        title: 'Support 1',
        description: 'A description',
        status: 'OPEN',
        priority: 'HIGH',
      },
    ]);

    await getSupportTicketsHandler(mockReq as Request, mockRes as Response);

    expect(supportTicketService.getAllSupportTickets).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({
      data: [
        {
          id: 'support-1',
          createdAt: expect.any(Date),
          title: 'Support 1',
          description: 'A description',
          status: 'OPEN',
          priority: 'HIGH',
        },
      ],
    });
  });
});

describe('createSupportTicketHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it('should return 200 on successful creation', async () => {
    const payload = {
      title: 'Support 1',
      description: 'A description',
      priority: 'HIGH',
    };
    mockReq = {
      body: payload,
    };
    const date = new Date();
    const mockSupportTicket: SupportTicket = {
      id: 'support-1',
      createdAt: date.toISOString(),
      title: 'Support 1',
      description: 'A description',
      status: 'OPEN',
      priority: 'HIGH',
    };

    vi.mocked(supportTicketService.createSupportTicket).mockResolvedValue({
      ...mockSupportTicket,
      createdAt: date,
    });

    await createSupportTicketHandler(mockReq as Request, mockRes as Response);

    expect(supportTicketService.createSupportTicket).toHaveBeenCalledTimes(1);
    expect(supportTicketService.createSupportTicket).toHaveBeenCalledWith(
      payload
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      data: expect.objectContaining({
        id: 'support-1',
        title: 'Support 1',
        status: 'OPEN',
      }),
    });
  });

  it('should return 400 on invalid input', async () => {
    const payload = {
      title: 'Support 1',
      description: 'A description',
      priority: 'unknown',
    };
    mockReq = {
      body: payload,
    };

    await createSupportTicketHandler(mockReq as Request, mockRes as Response);

    expect(supportTicketService.createSupportTicket).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid request' });
  });
});

describe('updateSupportTicketByIdHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it('should return 200 on successful update', async () => {
    mockReq = {
      params: { id: 'support-1' },
      body: { status: 'CLOSED' },
    };
    const date = new Date();
    const mockSupportTicket: SupportTicket = {
      id: 'support-1',
      createdAt: date.toISOString(),
      title: 'Support 1',
      description: 'A description',
      status: 'CLOSED',
      priority: 'MEDIUM',
    };
    vi.mocked(supportTicketService.updateSupportTicketById).mockResolvedValue({
      ...mockSupportTicket,
      createdAt: date,
    });

    await updateSupportTicketByIdHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(supportTicketService.updateSupportTicketById).toHaveBeenCalledTimes(
      1
    );
    expect(supportTicketService.updateSupportTicketById).toHaveBeenCalledWith(
      'support-1',
      { status: 'CLOSED' }
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      data: expect.objectContaining({ status: 'CLOSED', id: 'support-1' }),
    });
  });

  it('should return 404 if ticket not found', async () => {
    vi.mocked(supportTicketService.updateSupportTicketById).mockResolvedValue(
      null
    );

    mockReq = {
      params: { id: 'support-1' },
      body: { status: 'CLOSED' },
    };

    await updateSupportTicketByIdHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(supportTicketService.updateSupportTicketById).toHaveBeenCalledTimes(
      1
    );
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Not found',
    });
  });

  it('should return 400 on invalid input', async () => {
    vi.mocked(supportTicketService.updateSupportTicketById).mockResolvedValue(
      null
    );

    mockReq = {
      params: { id: 'support-1' },
      body: { status: 'unknown' },
    };

    await updateSupportTicketByIdHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(supportTicketService.updateSupportTicketById).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Invalid request',
    });
  });
});

describe('deleteSupportTicketByIdHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it('should return 200 on successful deletion', async () => {
    mockReq = {
      params: { id: 'support-1' },
    };
    vi.mocked(supportTicketService.deleteSupportTicketById).mockResolvedValue({
      id: 'support-1',
    });

    await deleteSupportTicketByIdHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(supportTicketService.deleteSupportTicketById).toHaveBeenCalledTimes(
      1
    );
    expect(mockRes.json).toHaveBeenCalledWith({ data: { id: 'support-1' } });
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 404 when no record is found', async () => {
    mockReq = {
      params: { id: 'support-3' },
    };
    vi.mocked(supportTicketService.deleteSupportTicketById).mockResolvedValue(
      null
    );

    await deleteSupportTicketByIdHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(supportTicketService.deleteSupportTicketById).toHaveBeenCalledTimes(
      1
    );
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not found' });
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});

describe('getHighPropritySupportTicketSummaryHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      log: {
        error: vi.fn(),
      } as unknown as Logger,
    };
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it('should return 200 with summary', async () => {
    const summary = 'No immediate support ticket requires any attention';
    vi.mocked(
      supportTicketService.getHighPrioritySupportTicketSummary
    ).mockResolvedValue(summary);

    await getHighPrioritySupportTicketSummaryHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(
      supportTicketService.getHighPrioritySupportTicketSummary
    ).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({ data: summary });
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 500 on failure to get summary', async () => {
    vi.mocked(
      supportTicketService.getHighPrioritySupportTicketSummary
    ).mockRejectedValue(new Error('Failed to get summary'));

    await getHighPrioritySupportTicketSummaryHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(
      supportTicketService.getHighPrioritySupportTicketSummary
    ).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Summary not available',
    });
  });
});

describe('getSupportTicketSummaryAvailabilityHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {};
    mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };
  });

  it('should return 200 and available status when feature summary is available', async () => {
    const mockIsAvailable = true;
    vi.mocked(
      supportTicketService.getSupportTicketSummaryAvailability
    ).mockReturnValue(mockIsAvailable);

    await getSupportTicketSummaryAvailabilityHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(
      supportTicketService.getSupportTicketSummaryAvailability
    ).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockIsAvailable });
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 422 with error message when feature summary is not available', async () => {
    const mockIsAvailable = false;
    vi.mocked(
      supportTicketService.getSupportTicketSummaryAvailability
    ).mockReturnValue(mockIsAvailable);

    await getSupportTicketSummaryAvailabilityHandler(
      mockReq as Request,
      mockRes as Response
    );

    expect(
      supportTicketService.getSupportTicketSummaryAvailability
    ).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(
      StatusCodes.UNPROCESSABLE_ENTITY
    );
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not available' });
  });
});
