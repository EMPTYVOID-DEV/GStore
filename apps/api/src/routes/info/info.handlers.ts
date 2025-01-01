import type { RouteHandler } from '@hono/zod-openapi';
import type { apiInfoRoute, keyInfoRoute } from './info.dal';
import { db, apiKeyTable, eq } from 'db';
import { env } from '@shared/env';
import { sha256 } from 'hono/utils/crypto';

export const apiInfoHandler: RouteHandler<typeof apiInfoRoute> = async (c) => {
  return c.json({ MAX_FILE_SIZE: env.MAX_FILE_SIZE, RATE_LIMITS: env.RATE_LIMITS, RATE_WINDOW: env.RATE_WINDOW });
};

export const keyInfoHandler: RouteHandler<typeof keyInfoRoute> = async (c) => {
  const { key } = c.req.valid('param');
  const hashedKey = (await sha256(key)) || '';
  const apiKey = await db.query.apiKeyTable.findFirst({ where: eq(apiKeyTable.key, hashedKey) });
  if (!apiKey) return c.notFound();
  return c.json(apiKey);
};
