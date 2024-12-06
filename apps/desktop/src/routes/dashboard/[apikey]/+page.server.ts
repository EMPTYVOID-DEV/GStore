import { db } from '$server/database/db';
import { apiKeyTable, fileTable, storeTable } from '$server/database/schema';
import { type Actions, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const load = async ({ params }: { params: { apikey: string }}) => {
	const currentApiKey = params.apikey;

	if (!currentApiKey) {
		return fail(400, { message: 'API key is required.' });
	}

	try {
		const keyInfoRes = await fetch(`${env.API_HOST}/info/key-info/${currentApiKey}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${currentApiKey}`,
			},
		});

		if (!keyInfoRes.ok) {
			const errorDetails = await keyInfoRes.json();
			return fail(404, { message: errorDetails.message || "API key doesn't exist!" });
		}

		const apiKeyInfo = await keyInfoRes.json();

		if (!apiKeyInfo.permissions || !apiKeyInfo.permissions.includes('list-files')) {
			return fail(403, { message: 'API key does not have permission to list files.' });
		}

		const filesRes = await fetch(`${env.API_HOST}/files/list`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${currentApiKey}`,
			},
		});

		if (!filesRes.ok) {
			const errorDetails = await filesRes.json();
			return fail(500, { message: errorDetails.message || 'Failed to fetch files.' });
		}

		const files = await filesRes.json();
		return { files };
	} catch (err) {
		console.error('Load error:', err);
		return fail(500, { message: 'An unexpected error occurred.' });
	}
};


export const actions: Actions = {
	upload: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const isPublic = formData.get('isPublic') === 'true';
		const tags = formData.get('tags') as string;
		const processedTags = tags.split(',').map((tag) => tag.trim());
		const currentApiKey = params.apikey;

		if (!file || !currentApiKey) {
			return fail(400, { message: 'File and API key are required.' });
		}

		try {
			const uploadFormData = new FormData();
			uploadFormData.append('file', file);
			uploadFormData.append('isPublic', isPublic.toString());
			uploadFormData.append('tags', JSON.stringify(processedTags));

			const keyRes = await fetch(`${env.API_HOST}/info/key-info/${currentApiKey}`, {
				method: 'GET',
			});

			if (!keyRes.ok) {
				const errorDetails = await keyRes.json();
				return fail(404, { message: errorDetails.message || "API key doesn't exist!" });
			}

			const apiKeyInfo = await keyRes.json();
			uploadFormData.append('storeId', apiKeyInfo.storeId);

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
	},
};