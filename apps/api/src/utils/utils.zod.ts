import type { z } from '@hono/zod-openapi';

export function zodStrNumber(str: string, c: z.RefinementCtx) {
  const idNumber = Number(str);
  if (isNaN(idNumber))
    c.addIssue({
      message: 'Field must be a number',
      code: 'invalid_string',
      validation: 'regex',
    });
  return idNumber;
}

export function serializeZodError(error: z.ZodError) {
  return {
    success: false,
    errors: error.errors.map((e) => ({
      message: e.message,
      field: e.path,
      reason: e.code,
    })),
  };
}

export function zodStrBoolean(str: string, c: z.RefinementCtx) {
  if (str == 'false') return false;
  if (str == 'true') return true;
  else
    c.addIssue({
      message: 'Field must be a boolean',
      code: 'invalid_string',
      validation: 'regex',
    });
  return true;
}
