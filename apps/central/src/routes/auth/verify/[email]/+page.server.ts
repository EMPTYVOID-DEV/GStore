import { dev } from '$app/environment';
import { sendVerificationEmail } from '$server/utils/email';
import { db } from '$server/database/db';
import { keyTable } from '$server/database/schema';
import { createSessionWrapper } from '$server/utils/auth';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

export const actions: Actions = {
	send: async ({ params, cookies }) => {
		const email = params.email!;
		const otp = customAlphabet('0123456789')(6);
		await sendVerificationEmail(email, otp);
		cookies.set('otp', otp, {
			path: '/auth/verify',
			httpOnly: true,
			maxAge: 60 * 10,
			secure: !dev
		});
	},
	verify: async ({ cookies, request, params }) => {
		const email = params.email!;
		const fd = await request.formData();
		const enteredOtp = fd.get('otp');
		const validOtp = cookies.get('otp');
		if (!validOtp) return fail(400, { message: 'The code has expired, try resend.' });
		// you can clear the cookie here
		if (enteredOtp != validOtp) return fail(403, { message: 'The entered code is not valid' });
		const userKey = (
			await db
				.update(keyTable)
				.set({ verified: true })
				.where(and(eq(keyTable.provider_name, 'email'), eq(keyTable.provider_id, email)))
				.returning({ userId: keyTable.userId })
		)[0];
		await createSessionWrapper(cookies, userKey.userId);
		redirect(302, '/dashboard');
	}
};
