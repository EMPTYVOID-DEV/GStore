import { db } from '$server/database/db';
import { apiKeyTable, fileTable, storeTable } from '$server/database/schema';
import { type Actions, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const load = async ({ params }: { params: { apikey: string } }) => {
	const currentApiKey = params.apikey;

	const key_store = await db
		.select()
		.from(apiKeyTable)
		.where(eq(apiKeyTable.key, currentApiKey))
		.limit(1);

	if (!key_store.length) {
		return fail(404, { message: "API key doesn't exist!" });
	}

	const store = await db
		.select()
		.from(storeTable)
		.where(eq(storeTable.id, key_store[0].storeId))
		.limit(1);

	if (!store.length) {
		return fail(404, { message: "Store doesn't exist!" });
	}

	const files = await db
		.select()
		.from(fileTable)
		.where(eq(fileTable.storeId, store[0].id));

	return { files };
};


export const actions: Actions = {
	upload: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const isPublic = formData.get('isPublic') === 'true';
		const tags = formData.get('tags') as string;
		const processedTags = tags.split(',').map(tag => tag.trim());
		const currentApiKey = params.apikey;
	
		if (!file || !currentApiKey) {
			return fail(400, { message: 'File and API key are required.' });
		}
	
		const key_store = await db
			.select()
			.from(apiKeyTable)
			.where(eq(apiKeyTable.key, currentApiKey))
			.limit(1);
	
		if (!key_store.length) {
			return fail(404, { message: "API key doesn't exist!" });
		}
	
		const storeId = key_store[0].storeId;
	
		try {
			const uploadFormData = new FormData();
			uploadFormData.append('file', file);
			uploadFormData.append('isPublic', isPublic.toString());
			uploadFormData.append('tags', JSON.stringify(processedTags));
			uploadFormData.append('storeId', storeId);
	
			const res = await fetch(`${env.API_HOST}/files/create`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${currentApiKey}`,
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
	delete: async ({ params, request, fetch }) => {
		const formData = await request.formData();
		const fileId = formData.get('fileId') as string;
		const currentApiKey = params.apikey;
	
		if (!fileId || !currentApiKey) {
			return fail(400, { message: 'File ID and API key are required.' });
		}
	
		try {
			const res = await fetch(`${env.API_HOST}/files/delete/${fileId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${currentApiKey}`,
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
	}
};
