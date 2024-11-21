import type { z } from 'zod';
import type { actionsSchema, configSchema, tracksSchema } from './zodSchemas';

export type SyncOptions = { configPath: string };

export type CommandName = 'sync' | 'generate-schema';

export type Actions = z.infer<typeof actionsSchema>;

export type ConfigJson = z.infer<typeof configSchema>;

export type TracksJson = z.infer<typeof tracksSchema>;

export type Permissions = 'create' | 'read' | 'delete' | 'update' | 'list-files' | 'apply-transformation';

export type ApiKey = {
  name: string;
  expiresAt: string;
  storeId: string;
  permissions: Permissions[];
  id: number;
  key: string;
};

export type FileEntry = {
  name: string;
  id: string;
  creationDate: string;
  storeId: string;
  extension: string;
  size: number;
  index: string;
  isPublic: boolean;
  tags: string[];
};

export type ApiInfo = {
  MAX_FILE_SIZE: number;
  RATE_WINDOW: number;
  RATE_LIMITS: number;
};
