import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db, sessionTable, userTable, eq } from 'db';
import type { Session } from 'db';
import type { SessionValidationResult } from '$server/types.server';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { sha256Hex } from './general';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(
	token: string,
	userId: string,
	expiresAt: Date
): Promise<Session> {
	const sessionId = encodeHexLowerCase(Uint8Array.from(sha256Hex(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt
	};
	await db.insert(sessionTable).values(session);
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(Uint8Array.from(sha256Hex(token)));
	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.id, session.id));
	}
	return { session, user };
}

export function setSessionTokenCookie(cookies: Cookies, token: string, expiresAt: Date): void {
	cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		secure: env.NODE_ENV == 'prod',
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
	cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export async function invalidateSession(sessionId: string) {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function createSessionWrapper(cookies: Cookies, userId: string) {
	const token = generateSessionToken();
	const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
	setSessionTokenCookie(cookies, token, expirationDate);
	await createSession(token, userId, expirationDate);
}
