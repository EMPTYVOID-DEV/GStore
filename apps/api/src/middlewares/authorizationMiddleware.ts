import { db, apiKeyTable, eq } from 'db';
import type { Permissions } from 'db';
import type { AuthorizationBinding } from '@shared/types.global';
import { createMiddleware } from 'hono/factory';

function getAuthorizationMiddleware(permission: Permissions) {
  return createMiddleware<AuthorizationBinding>(async (c, next) => {
    const authorizationHeader = c.req.header('Authorization');
    if (!authorizationHeader) return c.text('API key is required', 401);

    const key = authorizationHeader.split(' ')[1];
    const apiKeyEntry = await db.query.apiKeyTable.findFirst({
      where: eq(apiKeyTable.key, key),
    });

    if (!apiKeyEntry) return c.text('Invalid API key', 401);
    if (new Date() >= apiKeyEntry.expiresAt) return c.text('API key expired', 401);
    if (!apiKeyEntry.permissions.includes(permission)) return c.text('Insufficient permissions', 403);

    c.set('storeId', apiKeyEntry.storeId);
    await next();
  });
}

export default getAuthorizationMiddleware;
