import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';
import { env } from '@shared/env';

const client = new pg.Pool({ connectionString: env.DB_URL });

export const db: NodePgDatabase<typeof schema> = drizzle(client, {
  schema,
});
