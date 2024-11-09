import { ZodSchema, z } from 'zod';
import type { ActionStatus } from './types.global';

export const emailSchema = z.string().email('Invalid email address');

export const isNumberSchema = z.string().max(1).regex(/^\d$/);

export const passwordSchema = z
	.string()
	.min(8, { message: 'Password must be at least 8 characters long' })
	.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
	.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
	.regex(/\d/, { message: 'Password must contain at least one number' })
	.regex(/[!@#$%^&*(),.?"':{}|<>]/, {
		message: 'Password must contain at least one special character'
	});

export const usernameSchema = z
	.string()
	.min(4, {
		message: 'Username must at least 4 characters long'
	})
	.max(28, { message: 'Username must be no bigger than 28 characters' });

export const storeNameSchema = z
	.string()
	.min(3, { message: 'Store name must have at least three letters.' });

export function getValidator(schema: ZodSchema): (text: string) => ActionStatus {
	return (text: string) => {
		const parseResult = schema.safeParse(text);
		if (parseResult.success == true) return { state: 'valid', errorMsg: '' };
		else return { state: 'invalid', errorMsg: parseResult.error.errors[0].message };
	};
}
