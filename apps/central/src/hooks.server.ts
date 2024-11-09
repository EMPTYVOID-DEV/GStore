import { db } from '$server/database/db';
import { storeTable } from '$server/database/schema';
import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from '$server/utils/auth';
import { checkPath } from '$server/utils/general';

import { redirect, type Handle, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { and, eq } from 'drizzle-orm';

export const handleError: HandleServerError = async ({ error }) => {
	console.log(error);
	return {
		message: 'Service Unavailable'
	};
};

export const auth: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(event.cookies, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event.cookies);
	}

	event.locals.session = session;
	event.locals.user = user;
	return resolve(event);
};

export const redirects: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	const pathname = event.url.pathname;
	if (!user && checkPath(pathname, 'start', ['/dashboard'])) {
		redirect(303, '/auth');
	}

	if (user && checkPath(pathname, 'start', ['/auth'])) {
		redirect(303, '/dashboard');
	}

	if (user && event.params.store) {
		const storeId = event.params.store;
		const store = await db.query.storeTable.findFirst({
			where: and(eq(storeTable.userId, user.id), eq(storeTable.id, storeId))
		});
		if (!store) redirect(303, '/dashboard');
	}

	return resolve(event);
};

export const handle = sequence(auth, redirects);
