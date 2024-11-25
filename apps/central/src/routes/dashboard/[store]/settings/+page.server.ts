import { env } from '$env/dynamic/private';
import { db, storeTable, eq } from 'db';
import { error, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const storeId = params.store || '';
	const store = await db.query.storeTable.findFirst({ where: eq(storeTable.id, storeId) });
	return { store };
};

export const actions: Actions = {
	delete: async ({ params }) => {
		const storeId = params.store || '';
		try {
			const res = await fetch(`${env.API_HOST}/stores/delete/${storeId}`, {
				method: 'DELETE'
			});
			if (!res.ok) throw res;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (err) {
			error(500, { message: 'Unable to create the store' });
		}
	}
};
