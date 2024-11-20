import { z } from 'zod';

export const idSchema = z
  .string({ message: 'Id is a string' })
  .min(8, { message: 'Id must be 8 characters' })
  .max(8, { message: 'Id must be 8 characters' });

export const actionsSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('create'),
    data: z.object({
      path: z.string({ message: 'Path is required and must be a string' }),
      isPublic: z.boolean({ message: 'isPublic must be a boolean' }),
      tags: z.string({ message: 'Tags must be strings' }).array().default([]),
    }),
  }),
  z.object({
    name: z.literal('update'),
    data: z.object({
      id: idSchema,
      path: z.string({ message: 'Path must be a string' }).optional(),
      name: z.string({ message: 'Name must be a string' }).optional(),
      tags: z.string({ message: 'Tags must be strings' }).array().optional(),
    }),
  }),
  z.object({
    name: z.literal('delete'),
    data: z.object({
      id: idSchema,
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
