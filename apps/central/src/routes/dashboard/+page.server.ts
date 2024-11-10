import { env } from '$env/dynamic/private';
import { getValidator, storeNameSchema } from '$global/zod';
import { db } from '$server/database/db';
import { storeTable } from '$server/database/schema';
import { deleteSessionTokenCookie, invalidateSession } from '$server/utils/auth';
import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ locals }) => {
	const userId = locals.user?.id || '';
	const stores = await db.query.storeTable.findMany({ where: eq(storeTable.userId, userId) });
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
	create: async ({ request, locals }) => {
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
	}
};
