import type { Permissions } from '$global/types.global';
import { getValidator, keyNameSchema } from '$global/zod';
import { db } from '$server/database/db';
import { apiKeyTable } from '$server/database/schema';
import { fail, type Actions, type ServerLoad } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load: ServerLoad = async ({ params }) => {
	const storeId = params.store || '';
	const apiKeys = await db.query.apiKeyTable.findMany({
		where: eq(apiKeyTable.storeId, storeId),
		columns: { key: false, storeId: false, id: false }
	});
	return { apiKeys };
};

export const actions: Actions = {
	delete: async ({ params, request }) => {
		const storeId = params.store || '';
		const fd = await request.formData();
		const name = fd.get('name')?.toString() || '';
		await db
			.delete(apiKeyTable)
			.where(and(eq(apiKeyTable.name, name), eq(apiKeyTable.storeId, storeId)));
	},
	create: async ({ params, request }) => {
		const storeId = params.store ?? '';
		const formData = await request.formData();

		const name = formData.get('name')?.toString() || '';
		const permissionsJson = formData.get('permissions')?.toString() || '';
		const expiration = formData.get('expiration')?.toString() || '';

		const nameValidation = getValidator(keyNameSchema)(name);
		if (nameValidation.state === 'invalid') {
			return fail(400, { message: nameValidation.errorMsg });
		}

		let permissions: Permissions[];
		try {
			permissions = JSON.parse(permissionsJson);
		} catch {
			return fail(400, { message: 'Invalid permissions format' });
		}

		if (permissions.length === 0) {
			return fail(400, { message: 'Permissions cannot be empty' });
		}

		const expirationDate = new Date(expiration);
		if (isNaN(expirationDate.getTime()) || expirationDate < new Date()) {
			return fail(400, { message: 'Invalid expiration date' });
		}

		const key = await db
			.insert(apiKeyTable)
			.values({
				name,
				permissions,
				expiresAt: expirationDate,
				storeId
			})
			.returning();

		return key.at(0)?.key;
	}
};
