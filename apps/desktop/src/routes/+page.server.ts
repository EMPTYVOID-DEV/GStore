import { db } from '$server/database/db';
import { apiKeyTable } from '$server/database/schema';
import { type Actions, redirect, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getValidator, keyNameSchema } from '$global/zod';
import { env } from '$env/dynamic/private';

interface ApiKeyInfo {
    id: number;
    key: string;
    storeId: string;
    name: string;
    expiresAt: string;
    permissions: string[];
}

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

		const res = await fetch(`${env.API_HOST}/info/key-info/${key}`, { method: 'GET' });

		if (!res.ok) {
			const errorDetails = await res.json();
			return fail(404, { message: errorDetails.message || 'Your key is not found!' });
		}

		const apiKeyInfo: ApiKeyInfo = await res.json();

		throw redirect(303, `/dashboard/${apiKeyInfo.key}`);
    }
};
