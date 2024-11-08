import { z } from '@hono/zod-openapi';

export const createSchema = z.object({
  name: z.string().openapi({ description: 'The name of the store' }),
  userId: z.string().openapi({ description: 'The user Id' }),
});
