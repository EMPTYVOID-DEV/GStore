import { db } from '$server/database/db';
import { fileTable, storeTable } from '$server/database/schema';
import { type Actions, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const load = async ({ params }: { params: { store: string } }) => {
	const currentStore = params.store;

	const store = await db
		.select()
		.from(storeTable)
		.where(eq(storeTable.id, currentStore))
		.limit(1);

	if (!store.length) {
		return fail(404, { message: "Store doesn't exist!" });
	}

	const files = await db
		.select()
		.from(fileTable)
		.where(eq(fileTable.storeId, store[0].id));

	return { files, storeId: currentStore };
};

export const actions: Actions = {
	upload: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const isPublic = formData.get('isPublic') === 'true';
		const tagsRaw = formData.get('tags') as string | null;
		const tags = tagsRaw ? tagsRaw.split(',').map(tag => tag.trim()) : [];
		const storeId = params.store;
        const apiKey = formData.get('apiKey')

		if (!file || !storeId) {
			return fail(400, { message: 'File and Store ID are required.' });
		}

		try {
			const uploadFormData = new FormData();
			uploadFormData.append('file', file);
			uploadFormData.append('isPublic', isPublic.toString());
			uploadFormData.append('tags', JSON.stringify(tags));
			uploadFormData.append('storeId', storeId);

			const res = await fetch(`${env.API_HOST}/files/create`, {
				method: 'POST',
                headers: {
					'Authorization': `Bearer ${apiKey}`,
				},
				body: uploadFormData,
			});

			if (!res.ok) {
				const errorDetails = await res.json();
				throw new Error(errorDetails.message || 'File upload failed.');
			}

			const uploadedFile = await res.json();
			return { success: true, file: uploadedFile };
		} catch (err) {
			console.error('Upload error:', err);
			return fail(500, { message: 'Failed to upload file.' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const fileId = formData.get('fileId')
		const apiKey = formData.get('apiKey')

		if (!fileId || !apiKey) {
			return fail(400, { message: 'File ID and API key are required.' });
		}

		try {
			const res = await fetch(`${env.API_HOST}/files/delete/${fileId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${apiKey}`,
				},
			});

			if (!res.ok) {
				const errorDetails = await res.json();
				throw new Error(errorDetails.message || 'File delete failed.');
			}

			return { success: true, fileId };
		} catch (err) {
			console.error('Delete error:', err);
			return fail(500, { message: 'Failed to delete file.' });
		}
	},
};
