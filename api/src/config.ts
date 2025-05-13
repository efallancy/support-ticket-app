import 'dotenv/config';

import { z } from 'zod';

const configSchema = z.object({
  server: z.object({
    port: z.number().default(3000),
  }),
  openai: z.object({
    apiKey: z.optional(z.string()),
  }),
});

const maybeValidConfig = {
  server: {
    port: process.env.PORT,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
};

// Error shall be thrown if there is any missing ENV not being set
const config = configSchema.parse(maybeValidConfig);

export { config };
