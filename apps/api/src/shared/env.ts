import { z } from '@hono/zod-openapi';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']),

  DB_URL: z
    .string({
      required_error: 'Database URL is required',
    })
    .url({
      message: 'Invalid database URL format',
    }),

  PORT: z.coerce.number().int().min(1, 'Port must be greater than 0').max(65535, 'Port must be less than or equal to 65535'),

  MAX_FILE_SIZE: z.coerce
    .number({
      required_error: 'Maximum file size is required',
      invalid_type_error: 'Maximum file size must be a number',
    })
    .positive('Maximum file size must be positive')
    .int('Maximum file size must be an integer'),

  RATE_WINDOW: z.coerce
    .number({
      required_error: 'Rate window is required',
      invalid_type_error: 'Rate window must be a number',
    })
    .positive('Rate window must be positive')
    .int('Rate window must be an integer'),

  ROOT_DIR: z.string({
    required_error: 'Root directory path is required',
  }),

  RATE_LIMITS: z.coerce
    .number({
      required_error: 'Rate limits value is required',
      invalid_type_error: 'Rate limits must be a number',
    })
    .positive('Rate limits must be positive')
    .int('Rate limits must be an integer'),
});

export const env = envSchema.parse(process.env);
