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
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long' }),
  status: supportTicketStatusEnum,
  priority: supportTicketPriorityEnum,
  createdAt: z.string().datetime(),
});

type SupportTicket = z.infer<typeof supportTicketSchema>;

const supportTicketCreateSchema = supportTicketSchema.pick({
  title: true,
  description: true,
  priority: true,
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
  type SupportTicket,
  type SupportTicketCreate,
  supportTicketCreateSchema,
  supportTicketPriorityEnum,
  supportTicketSchema,
  supportTicketStatusEnum,
  type SupportTicketUpdate,
  supportTicketUpdateSchema,
};
