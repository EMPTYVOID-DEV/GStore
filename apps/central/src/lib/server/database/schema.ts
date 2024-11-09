import type { Permissions } from '$global/types.global';
import { sql } from 'drizzle-orm';
import {
	pgTable,
	text,
	primaryKey,
	timestamp,
	boolean,
	varchar,
	date,
	serial,
	unique,
	real,
	uniqueIndex
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

export const userTable = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').notNull()
});

export const sessionTable = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull()
});

export const keyTable = pgTable(
	'key',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userTable.id, {
				onDelete: 'cascade'
			}),
		provider_name: text('provider_name').notNull(),
		provider_id: text('provider_id').notNull(),
		secret: text('secret').notNull(),
		verified: boolean('verified').notNull()
	},
	(table) => [primaryKey({ columns: [table.provider_id, table.provider_name] })]
);

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
			.references(() => userTable.id, { onDelete: 'cascade' })
	},
	(t) => [unique('unique_name').on(t.name, t.userId), uniqueIndex('name').on(t.name, t.userId)]
);

export const apiKeyTable = pgTable(
	'apiKey',
	{
		id: serial('id').primaryKey(),
		key: varchar('key', { length: 32 })
			.$default(() => nanoid(32))
			.unique(),
		storeId: varchar('store_id', { length: 8 })
			.notNull()
			.references(() => storeTable.id, { onDelete: 'cascade' }),
		expiresAt: timestamp('expires_at').notNull(),
		permissions: text('permissions').array().$type<Permissions[]>().notNull()
	},
	(t) => [uniqueIndex('key_index').on(t.key)]
);

export const fileTable = pgTable('file', {
	id: varchar('id', { length: 8 })
		.$default(() => nanoid(8))
		.primaryKey(),
	name: text('name').notNull(),
	extension: text('extension').notNull(),
	size: real('size').notNull(),
	creationDate: date('creation_date', { mode: 'string' }).$default(
		() => new Date().toISOString().split('T')[0]
	),
	storeId: varchar('store_id', { length: 8 })
		.notNull()
		.references(() => storeTable.id, { onDelete: 'cascade' }),
	index: varchar('index', { length: 32 }).notNull().unique(),
	isPublic: boolean('public').default(false).notNull(),
	tags: text('tags')
		.array()
		.default(sql`ARRAY[]::text[]`)
		.notNull()
});
