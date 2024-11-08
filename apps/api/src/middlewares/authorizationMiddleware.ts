import { db } from '@database/db';
import { apiKeyTable } from '@database/schema';
import type { Permissions } from '@shared/types.global';
import type { AuthorizationBinding } from '@shared/types.global';
import { eq } from 'drizzle-orm';
import { createMiddleware } from 'hono/factory';

function getAuthorizationMiddleware(permission: Permissions) {
  return createMiddleware<AuthorizationBinding>(async (c, next) => {
    const authorizationHeader = c.req.header('Authorization');
    if (!authorizationHeader) return c.text('API key is required', 403);

    const key = authorizationHeader.split(' ')[1];
    const apiKeyEntry = await db.query.apiKeyTable.findFirst({
      where: eq(apiKeyTable.key, key),
    });

    if (!apiKeyEntry) return c.text('Invalid API key', 403);
    if (new Date() >= apiKeyEntry.expiresAt) return c.text('API key expired', 403);
    if (!apiKeyEntry.permissions.includes(permission)) return c.text('Insufficient permissions', 403);

    c.set('storeId', apiKeyEntry.storeId);
    await next();
  });
}

export default getAuthorizationMiddleware;
