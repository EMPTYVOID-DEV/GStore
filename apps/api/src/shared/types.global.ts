import { z } from '@hono/zod-openapi';
import type { envSchema } from './schema.global';

export type AuthorizationBinding = {
  Variables: {
    storeId: string;
  };
};

export type Permissions = 'create' | 'read' | 'delete' | 'update' | 'list-files' | 'apply-transformation';

export type Operations = 'create' | 'read' | 'delete' | 'update' | 'apply-transformation';

export type EnvType = z.infer<typeof envSchema>;
