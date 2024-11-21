import { db } from '$server/database/db';
import { apiKeyTable, fileTable, storeTable } from '$server/database/schema';
import { type Actions, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getValidator, keyNameSchema } from '$global/zod';

export const actions: Actions = {
	'access_store': async ({ request }) => {
		const fd = await request.formData();
		const key = fd.get('key')?.toString();

		if (!key) {
			return fail(400, { message: 'API key is required' });
		}

		const validateKey = getValidator(keyNameSchema);
		const validation = validateKey(key);

		if (validation.state === 'invalid') {
			return fail(403, { message: validation.errorMsg });
		}

		const apikey = await db
				.select()
				.from(apiKeyTable)
				.where(eq(apiKeyTable.key, key))
				.limit(1);

		if (apikey.length == 0) {
			return fail(404, { message: 'Invalid API key. No associated store found.' });
		}

		const storeId = apikey[0].storeId;

		const store = await db
			.select()
			.from(storeTable)
			.where(eq(storeTable.id, storeId))
			.limit(1);

		if (store.length == 0) {
			return fail(404, { message: 'No store associated with this API key.' });
		}

		throw redirect(303, `/dashboard/${store[0].id}`);

	}
};
