import { z } from 'zod';

const idSchema = z
  .string({ message: 'Id is a string' })
  .min(8, { message: 'Id must be 8 characters' })
  .max(8, { message: 'Id must be 8 characters' });

const dirPathSchema = z.string({ message: 'Directory path is required and must be a string' }).refine((path) => path.endsWith('/'), {
  message: 'Directory path must end with a "/"',
});

const filePathSchema = z.string({ message: 'File path is required and must be a string' }).refine((path) => !path.endsWith('/'), {
  message: 'File path must not end with a "/"',
});

const isPublicSchema = z.boolean({ message: 'isPublic must be a boolean' });

const tagsSchema = z.string({ message: 'Tags must be strings' }).array();

export const actionsSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('create'),
    data: z.object({
      path: filePathSchema,
      isPublic: isPublicSchema,
      tags: tagsSchema.default([]),
    }),
  }),
  z.object({
    name: z.literal('createDir'),
    data: z.object({
      path: dirPathSchema,
      isPublic: isPublicSchema,
      tags: tagsSchema.default([]),
    }),
  }),
  z.object({
    name: z.literal('update'),
    data: z.object({
      id: idSchema,
      path: filePathSchema.optional(),
      tags: tagsSchema.optional(),
      name: z.string().optional(),
    }),
  }),
  z.object({
    name: z.literal('delete'),
    data: z.object({
      id: idSchema,
    }),
  }),
  z.object({
    name: z.literal('backup'),
    data: z.object({
      path: dirPathSchema,
      isPublic: isPublicSchema,
      tags: tagsSchema.default([]),
    }),
  }),
]);

export const configSchema = z.object({
  trackingFile: z.string().describe('This specifies the path to the tracking').optional(),
  key: z.string({ message: 'Key must be a string' }).min(32, { message: 'Key size is 32' }).max(32, { message: 'Key size is 32' }),
  host: z.string({ message: 'Host must be a string' }).refine((host) => !host.endsWith('/'), {
    message: 'Host must not end with a "/"',
  }),
  actions: z.record(z.string({ message: 'Action key must be a string' }), actionsSchema, {
    message: 'Actions must be a record of valid actions',
  }),
});

export const tracksSchema = z.object({
  tracks: z.object({ id: idSchema, path: z.string() }, { message: 'Track contain file id and path to it locally' }).array(),
});
