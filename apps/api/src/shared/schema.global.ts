import { z } from '@hono/zod-openapi';
import { byteToMega } from '@utils/utils.general';

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
