import type { Session, User } from 'db';
import type { pathCheckModes } from './const.server';

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export type PathCheckModes = typeof pathCheckModes;
