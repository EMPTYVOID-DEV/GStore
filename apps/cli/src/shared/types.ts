import type { z } from 'zod';
import type { actionsSchema, configSchema } from './zodSchemas';

export type CliOptions = { config: string };

export type Actions = z.infer<typeof actionsSchema>;

export type Config = z.infer<typeof configSchema>;
