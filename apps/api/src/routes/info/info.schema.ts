import { z } from '@hono/zod-openapi';

export const keyInfoSchema = z.object({
  key: z.string().min(32).max(32).openapi({ description: 'The api key value' }),
});
