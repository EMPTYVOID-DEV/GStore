import type { Permissions } from './types.js';
import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, varchar, date, serial, unique, real } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const userTable = pgTable('user', {
  id: text('id')
    .$default(() => nanoid(8))
    .primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  admin: boolean('admin').notNull(),
});

export const sessionTable = pgTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});

export const storeTable = pgTable(
  'store',
  {
    id: varchar('id', { length: 8 })
      .$default(() => nanoid(8))
      .primaryKey(),
    name: text('name').notNull(),
    creationDate: date('creation_date', { mode: 'string' })
      .$default(() => new Date().toISOString().split('T')[0])
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
  },
  (t) => [unique('unique_name').on(t.name, t.userId)],
);

export const apiKeyTable = pgTable(
  'apiKey',
  {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 64 }).notNull().unique(),
    storeId: varchar('store_id', { length: 8 })
      .notNull()
      .references(() => storeTable.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    permissions: text('permissions').array().$type<Permissions[]>().notNull(),
  },
  (t) => [unique('key_index').on(t.key), unique('name').on(t.name, t.storeId)],
);

export const fileTable = pgTable('file', {
  id: varchar('id', { length: 8 })
    .$default(() => nanoid(8))
    .primaryKey(),
  name: text('name').notNull(),
  extension: text('extension').notNull(),
  size: real('size').notNull(),
  creationDate: date('creation_date', { mode: 'string' }).$default(() => new Date().toISOString().split('T')[0]),
  storeId: varchar('store_id', { length: 8 })
    .notNull()
    .references(() => storeTable.id, { onDelete: 'cascade' }),
  index: varchar('index', { length: 32 }).notNull().unique(),
  isPublic: boolean('public').default(false).notNull(),
  tags: text('tags')
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
});
