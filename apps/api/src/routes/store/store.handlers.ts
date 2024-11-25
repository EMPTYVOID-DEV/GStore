import { z, type RouteHandler } from '@hono/zod-openapi';
import type { createStoreRoute, deleteStoreRoute } from './store.dal';
import { db, storeTable, eq } from 'db';
import { HTTPException } from 'hono/http-exception';
import { mkdir, rm } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { env } from '@shared/env';

export const createStoreHandler: RouteHandler<typeof createStoreRoute> = async (c) => {
  const { name, userId } = c.req.valid('json');
  try {
    const id = nanoid(8);
    const storePath = path.join(env.ROOT_DIR, 'storage', id);
    await db.insert(storeTable).values({ name, userId, id }).returning();
    await Promise.all([
      mkdir(path.join(storePath, 'public'), { recursive: true }),
      mkdir(path.join(storePath, 'private'), { recursive: true }),
    ]);
    return c.json({ id }, { status: 201 });
  } catch (error) {
    const parseResult = z.object({ code: z.union([z.literal('23505'), z.literal('23503')]) }).safeParse(error);
    if (parseResult.success && parseResult.data.code == '23503') return c.notFound();
    if (parseResult.success && parseResult.data.code == '23505')
      return c.newResponse(`There is already a store with that name in ${userId} account`, 403);
    throw new HTTPException(500, { message: 'Something went wrong when creating a store' });
  }
};

export const deleteStoreHandler: RouteHandler<typeof deleteStoreRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const store = await db.delete(storeTable).where(eq(storeTable.id, id)).returning();
  if (store.length == 0) return c.notFound();
  const storePath = path.join(env.ROOT_DIR, 'storage', id);
  await rm(storePath, { recursive: true });
  return c.json(store.at(0));
};
