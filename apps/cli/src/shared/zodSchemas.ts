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
    name: z.literal('read'),
    data: z.object({
      id: idSchema,
    }),
  }),
  z.object({
    name: z.literal('readTags'),
    data: z.object({
      tags: z.string({ message: 'Tags must be strings' }).array().min(1, { message: 'At least one tag is required' }),
    }),
  }),
  z.object({
    name: z.literal('list'),
    data: z.object({
      size: z.number({ message: 'Size must be a number' }).positive({ message: 'Size must be positive' }).default(10),
      page: z.number({ message: 'Page must be a number' }).min(0, { message: 'Page must be non-negative' }).default(0),
      orderBy: z
        .enum(['size-asc', 'name-asc', 'date-asc', 'size-desc', 'name-desc', 'date-desc'], {
          message: 'Invalid order criteria',
        })
        .default('name-asc'),
      name: z.string({ message: 'Name must be a string' }).optional(),
      extension: z.string({ message: 'Extension must be a string' }).optional(),
      tags: z.string({ message: 'Tags must be strings' }).array().optional(),
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
  tracking: z.boolean({ message: 'Tracking must be a boolean' }),
  key: z.string({ message: 'Key must be a string' }).min(32, { message: 'Key size is 32' }).max(32, { message: 'Key size is 32' }),
  host: z.string({ message: 'Host must be a string' }),
  actions: z.record(z.string({ message: 'Action key must be a string' }), actionsSchema, {
    message: 'Actions must be a record of valid actions',
  }),
  tracks: z
    .object({
      id: idSchema,
      path: z.string({ message: 'Path must be a string' }),
    })
    .array()
    .optional(),
});
