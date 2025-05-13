import { z } from 'zod';

const supportTicketStatusEnum = z.enum([
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]);

const supportTicketPriorityEnum = z.enum(['HIGH', 'MEDIUM', 'LOW']);

const supportTicketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: supportTicketStatusEnum,
  priority: supportTicketPriorityEnum,
  createdAt: z.string().datetime(),
});

type SupportTicket = z.infer<typeof supportTicketSchema>;

const supportTicketCreateSchema = supportTicketSchema
  .pick({
    title: true,
    description: true,
    priority: true,
  })
  .extend({
    priority: supportTicketPriorityEnum.optional(),
  });

type SupportTicketCreate = z.infer<typeof supportTicketCreateSchema>;

const supportTicketUpdateSchema = supportTicketSchema
  .omit({
    createdAt: true,
  })
  .partial()
  .extend({
    id: z.string(),
  });

type SupportTicketUpdate = z.infer<typeof supportTicketUpdateSchema>;

export {
  SupportTicket,
  SupportTicketCreate,
  supportTicketCreateSchema,
  supportTicketPriorityEnum,
  supportTicketSchema,
  supportTicketStatusEnum,
  SupportTicketUpdate,
  supportTicketUpdateSchema,
};
