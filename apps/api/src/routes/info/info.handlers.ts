import type { RouteHandler } from '@hono/zod-openapi';
import type { apiInfoRoute, keyInfoRoute } from './info.dal';
import { db } from '@database/db';
import { eq } from 'drizzle-orm';
import { apiKeyTable } from '@database/schema';

export const apiInfoHandler: RouteHandler<typeof apiInfoRoute> = async (c) => {
  return c.json({ MAX_FILE_SIZE: process.env.MAX_FILE_SIZE, RATE_LIMITS: process.env.RATE_LIMITS, RATE_WINDOW: process.env.RATE_WINDOW });
};

export const keyInfoHandler: RouteHandler<typeof keyInfoRoute> = async (c) => {
  const { key } = c.req.valid('param');
  const apiKey = await db.query.apiKeyTable.findFirst({ where: eq(apiKeyTable.key, key) });
  if (!apiKey) return c.notFound();
  return c.json(apiKey);
};
