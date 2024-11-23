import { db } from '$server/database/db';
import { createSessionWrapper } from '$server/utils/auth';
import { getValidator, passwordSchema, usernameSchema } from '$global/zod';
import { type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { verify } from '@node-rs/argon2';
import { fail } from '@sveltejs/kit';
import { userTable } from '$server/database/schema';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const fd = await request.formData();
		const username = fd.get('username')!.toString();
		const password = fd.get('password')!.toString();
		const validateUsername = getValidator(usernameSchema);
		const validatePassword = getValidator(passwordSchema);
		if (validateUsername(username).state == 'invalid')
			return fail(403, { message: validateUsername(username).errorMsg });
		if (validatePassword(password).state == 'invalid')
			return fail(403, { message: validatePassword(password).errorMsg });

		const user = await db.query.userTable.findFirst({
			where: eq(userTable.username, username)
		});
		if (!user) return fail(404, { message: 'It seems the user does not exist.' });
		const isValid = await verify(user.password, password);
		if (!isValid) return fail(403, { message: 'The password is not correct.' });
		await createSessionWrapper(cookies, user.id);
		redirect(303, '/dashboard');
	}
};
