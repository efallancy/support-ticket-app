import 'dotenv/config';

import { z } from 'zod';

const configSchema = z.object({
  server: z.object({
    port: z.number().default(3000),
  }),
});

const maybeValidConfig = {
  server: {
    port: process.env.PORT,
  },
};

// Error shall be thrown if there is any missing ENV not being set
const config = configSchema.parse(maybeValidConfig);

export { config };
