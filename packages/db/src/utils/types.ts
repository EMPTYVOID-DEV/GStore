import type { sessionTable, userTable, storeTable, apiKeyTable, fileTable } from './schema.js';

export type Permissions = 'create' | 'read' | 'delete' | 'update' | 'list-files' | 'apply-transformation';

export type Operations = 'create' | 'read' | 'delete' | 'update' | 'apply-transformation';

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type Store = typeof storeTable.$inferSelect;

export type ApiKey = typeof apiKeyTable.$inferSelect;

export type ApiFile = typeof fileTable.$inferSelect;

export type InsertSession = typeof sessionTable.$inferInsert;

export type InsertUser = typeof userTable.$inferInsert;

export type InsertStore = typeof storeTable.$inferInsert;

export type InsertApiKey = typeof apiKeyTable.$inferInsert;

export type InsertApiFile = typeof fileTable.$inferInsert;
