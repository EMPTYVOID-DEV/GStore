import { z } from '@hono/zod-openapi';
import { byteToMega } from '@utils/utils.general';

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

  VER: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, {
      message: 'Version must be in semantic versioning format (e.g., 1.0.0)',
    })
    .optional(),

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

export const zodErrorSchema = z.object({
  success: z.boolean(),
  errors: z
    .object({
      message: z.string(),
      field: z.union([z.string(), z.number()]),
      reason: z.string(),
    })
    .array(),
});

export const fileSchema = z
  .instanceof(File, { message: 'file is required' })
  .refine((f) => f.size != 0, { message: "file can't be empty" })
  .refine((f) => byteToMega(f.size) <= process.env.MAX_FILE_SIZE, {
    message: `file can not exceed this file size ${process.env.MAX_FILE_SIZE} mb`,
  });

export const idSchema = z.string().min(8).max(8);

export const outputMethod = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('return').openapi({
      description: 'This specifies that transformation output need to be returned.',
    }),
  }),
  z.object({
    type: z.literal('update').openapi({
      description: 'This specifies that transformation output need to update another file.',
    }),
    id: idSchema,
  }),
  z.object({
    type: z.literal('create').openapi({
      description: 'This specifies that transformation output need to create a new file.',
    }),
    metaData: z.object({
      name: z.string().openapi({ description: 'This is the file name', type: 'string' }),
      isPublic: z.boolean().openapi({
        type: 'boolean',
        description: 'This specifies whether the file is public or private',
      }),
      tags: z.string().array().default([]).openapi({
        description: 'Tags for created file. Used for filtering when listing or reading files',
      }),
    }),
  }),
]);

export const singleInputSchema = z.object({
  id: idSchema.openapi({
    description: 'File id selected for transformation',
  }),
  outputMethod: outputMethod,
});

export const idParamSchema = z.object({
  id: idSchema.openapi({ param: { description: 'File id', in: 'path' } }),
});
