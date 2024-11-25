import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { storeTable, userTable, sessionTable, apiKeyTable, fileTable } from './schema.js';

export const selectStoreSchema = createSelectSchema(storeTable);

export const insertStoreSchema = createInsertSchema(storeTable);

export const selectUserSchema = createSelectSchema(userTable);

export const insertUserSchema = createInsertSchema(userTable);

export const selectSessionSchema = createSelectSchema(sessionTable);

export const insertSessionSchema = createInsertSchema(sessionTable);

export const selectFileSchema = createSelectSchema(fileTable);

export const insertFileSchema = createInsertSchema(fileTable);

export const selectApiKeySchema = createSelectSchema(apiKeyTable);

export const insertApiKeySchema = createInsertSchema(apiKeyTable);
