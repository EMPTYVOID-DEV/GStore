import { db } from '$server/database/db';
import { keyTable } from '$server/database/schema';
import { createSessionWrapper } from '$server/utils/auth';
import { insertUser } from '$server/utils/database';
import type { Key, User } from '$server/types.server';
import { getValidator, emailSchema, passwordSchema, usernameSchema } from '$global/zod';
import { type Actions, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { hash, verify } from '@node-rs/argon2';
import { nanoid } from 'nanoid';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	'Sign up': async ({ request }) => {
		const fd = await request.formData();
		const username = fd.get('username')!.toString();
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const validateEmail = getValidator(emailSchema);
		const validateUsername = getValidator(usernameSchema);
		const validatePassword = getValidator(passwordSchema);
		if (validateUsername(username).state == 'invalid')
			return fail(403, { message: validateUsername(username).errorMsg });
		if (validateEmail(email).state == 'invalid')
			return fail(403, { message: validateEmail(email).errorMsg });
		if (validatePassword(password).state == 'invalid')
			return fail(403, { message: validatePassword(password).errorMsg });
		const id = nanoid(8);
		const hashedPassword = await hash(password);
		const newUser: User = {
			id,
			username
		};
		const key: Key = {
			provider_name: 'email',
			provider_id: email,
			userId: id,
			secret: hashedPassword,
			verified: false
		};
		try {
			await insertUser(newUser, key);
		} catch (error) {
			if (error.code === '23505')
				return fail(409, { message: 'It seems that this account already exist.' });
		}
		redirect(302, `/auth/verify/${email}`);
	},
	'Sign in': async ({ cookies, request }) => {
		const fd = await request.formData();
		const email = fd.get('email')!.toString();
		const password = fd.get('password')!.toString();
		const validateEmail = getValidator(emailSchema);
		const validatePassword = getValidator(passwordSchema);
		if (validateEmail(email).state == 'invalid')
			return fail(403, { message: validateEmail(email).errorMsg });
		if (validatePassword(password).state == 'invalid')
			return fail(403, { message: validatePassword(password).errorMsg });
		const userKey = await db.query.keyTable.findFirst({
			where: and(eq(keyTable.provider_name, 'email'), eq(keyTable.provider_id, email))
		});
		if (!userKey) return fail(404, { message: 'It seems the user does not exist.' });
		const isValid = await verify(userKey.secret, password);
		if (!isValid) return fail(403, { message: 'The password is not correct.' });
		if (userKey.verified) {
			await createSessionWrapper(cookies, userKey.userId);
			redirect(302, '/stores');
		}
		redirect(302, `/auth/verify/${email}`);
	}
};
