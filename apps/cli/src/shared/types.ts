import type { z } from 'zod';
import type { actionsSchema, configSchema } from './zodSchemas';

export type CliOptions = { config: string };

export type Actions = z.infer<typeof actionsSchema>;

export type Config = z.infer<typeof configSchema>;

export type Permissions = 'create' | 'read' | 'delete' | 'update' | 'list-files' | 'apply-transformation';

export type ApiKey = {
  name: string;
  expiresAt: string;
  storeId: string;
  permissions: Permissions[];
  id: number;
  key: string;
};

export type ApiInfo = {
  MAX_FILE_SIZE: number;
  RATE_WINDOW: number;
  RATE_LIMITS: number;
};
