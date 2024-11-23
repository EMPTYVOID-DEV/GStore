import { env } from '$env/dynamic/private';
import type { InsertUser } from '$global/types.global';
import { getValidator, passwordSchema, storeNameSchema, usernameSchema } from '$global/zod';
import { db } from '$server/database/db';
import { storeTable, userTable } from '$server/database/schema';
import { deleteSessionTokenCookie, invalidateSession } from '$server/utils/auth';
import { hash } from '@node-rs/argon2';
import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ locals }) => {
	const userId = locals.user?.id || '';
	const isAdmin = locals.user?.admin;
	const stores = await db.query.storeTable.findMany({ where: eq(storeTable.userId, userId) });
	if (isAdmin) {
		const users = await db.query.userTable.findMany({ columns: { username: true } });
		return {
			users,
			stores
		};
	} else
		return {
			stores
		};
};

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		const sessionId = locals.session?.id || '';
		deleteSessionTokenCookie(cookies);
		await invalidateSession(sessionId);
		redirect(303, '/');
	},
	create_store: async ({ request, locals }) => {
		const fd = await request.formData();
		const name = fd.get('name')!.toString();
		const storeNameValidator = getValidator(storeNameSchema);
		const valid = storeNameValidator(name);
		if (valid.state == 'invalid') return fail(400, { message: valid.errorMsg });
		const userId = locals.user?.id || '';
		try {
			const res = await fetch(`${env.API_HOST}/stores/create`, {
				method: 'POST',
				body: JSON.stringify({ userId, name }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!res.ok) throw res;
		} catch (err) {
			const resError = err as Response;
			if (resError.status == 403)
				return fail(403, { message: 'A store with the same name already exits' });
			error(500, { message: 'Unable to create the store' });
		}
	},
	create_user: async ({ request, locals }) => {
		if (!locals.user?.admin) error(403, 'Forbidden action');

		const fd = await request.formData();
		const username = fd.get('username')!.toString().toLowerCase();
		const password = fd.get('password')!.toString();

		const validateUsername = getValidator(usernameSchema);
		const validatePassword = getValidator(passwordSchema);

		if (validateUsername(username).state == 'invalid')
			return fail(403, { message: validateUsername(username).errorMsg });
		if (validatePassword(password).state == 'invalid')
			return fail(403, { message: validatePassword(password).errorMsg });

		const hashedPassword = await hash(password);
		const newUser: InsertUser = {
			username,
			password: hashedPassword,
			admin: false
		};

		try {
			await db.insert(userTable).values(newUser);
		} catch (error) {
			if (error.code === '23505') return fail(409, { message: 'User already exists.' });
		}
	},
	delete_user: async ({ request, locals }) => {
		if (!locals.user?.admin) error(403, 'Forbidden action');

		const fd = await request.formData();
		const adminUsername = locals.user.username;
		const targetUsername = fd.get('username')!.toString();

		if (adminUsername == targetUsername) error(403, 'Forbidden action');

		await db.delete(userTable).where(eq(userTable.username, targetUsername));
	}
};
