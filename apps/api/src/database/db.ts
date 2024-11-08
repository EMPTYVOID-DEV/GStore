import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

const client = new pg.Pool({ connectionString: process.env.DB_URL });

export const db: NodePgDatabase<typeof schema> = drizzle(client, {
  schema,
});
