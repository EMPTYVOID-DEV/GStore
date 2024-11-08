import type { Context } from 'hono';
import { z } from '@hono/zod-openapi';
import { serializeZodError } from '@utils/utils.zod';

export function zodHook(res: { success: true } | { success: false; error: z.ZodError }, c: Context) {
  if (res.success) {
    return;
  }

  return c.json(serializeZodError(res.error), { status: 400 });
}
