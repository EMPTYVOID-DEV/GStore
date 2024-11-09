import type {
	apiKeyTable,
	keyTable,
	sessionTable,
	storeTable,
	userTable
} from '$server/database/schema';

export type Session = typeof sessionTable.$inferInsert;

export type User = typeof userTable.$inferInsert;

export type Key = typeof keyTable.$inferInsert;

export type Store = typeof storeTable.$inferInsert;

export type ApiKey = typeof apiKeyTable.$inferInsert;

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
