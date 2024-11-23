import type { apiKeyTable, sessionTable, storeTable, userTable } from '$server/database/schema';

export type Session = typeof sessionTable.$inferSelect;

export type User = typeof userTable.$inferSelect;

export type InsertUser = typeof userTable.$inferInsert;

export type Store = typeof storeTable.$inferSelect;

export type ApiKey = typeof apiKeyTable.$inferSelect;

export type Permissions =
	| 'create'
	| 'read'
	| 'delete'
	| 'update'
	| 'list-files'
	| 'apply-transformation';

export type Operations = 'create' | 'read' | 'delete' | 'update' | 'apply-transformation';

export type ActionStatus = {
	state: 'valid' | 'invalid';
	errorMsg: string;
};
