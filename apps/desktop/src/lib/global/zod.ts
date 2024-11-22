import type { ZodSchema } from 'zod';
import { z } from 'zod';
import type { ActionStatus } from './types.global';

export const keyNameSchema = z
	.string()
	.min(3, { message: 'Key name must have at least three letters.' });

export function getValidator(schema: ZodSchema): (text: string) => ActionStatus {
	return (text: string) => {
		const parseResult = schema.safeParse(text);
		if (parseResult.success == true) return { state: 'valid', errorMsg: '' };
		else return { state: 'invalid', errorMsg: parseResult.error.errors[0].message };
	};
}
