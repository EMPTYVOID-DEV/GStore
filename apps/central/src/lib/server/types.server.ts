import type { pathCheckModes } from './const.server';
import type { keyTable, sessionTable, userTable } from './database/schema';

export type Session = typeof sessionTable.$inferInsert;

export type User = typeof userTable.$inferInsert;

export type Key = typeof keyTable.$inferInsert;

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export type PathCheckModes = typeof pathCheckModes;
