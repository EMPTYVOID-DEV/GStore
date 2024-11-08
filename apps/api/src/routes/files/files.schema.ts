import { z } from '@hono/zod-openapi';
import { fileSchema } from '@shared/schema.global';
import { zodStrBoolean, zodStrNumber } from '@utils/utils.zod';

export const indexParamSchema = z.object({
  index: z
    .string()
    .min(32)
    .openapi({
      param: {
        in: 'path',
        description: 'The index is the random name of the public file including its extension.',
        example: `/public/KPrWbgY4ULwpoQMUOCP5rCk55qeaXPA_.jpg`,
      },
    }),
});

export const readTagsSchema = z.object({
  tags: z
    .union([z.string(), z.string().array()])
    .transform((val) => (val instanceof Array ? val : [val]))
    .openapi({
      param: {
        description: 'Tags that file need to be apart of',
        in: 'query',
      },
    }),
});

export const createSchema = z.object({
  file: fileSchema.openapi({
    type: 'string',
    description: 'File to be created',
  }),
  isPublic: z.string().transform(zodStrBoolean).openapi({
    type: 'boolean',
    description: 'This specifies whether the file is public or private',
  }),
  tags: z
    .union([z.string(), z.string().array()])
    .transform((val) => (val instanceof Array ? val : [val]))
    .default([])
    .openapi({
      description: 'Tags for created file. Used for filtering when listing or reading files',
    }),
});

export const listSchema = z.object({
  size: z
    .string()
    .default('10')
    .transform((str, c) => {
      const num = zodStrNumber(str, c);
      if (num <= 0)
        c.addIssue({
          message: 'size must be bigger than zero',
          code: 'invalid_string',
          validation: 'regex',
        });
      return num;
    })
    .openapi({
      default: '10',
      type: 'integer',
      param: {
        in: 'query',
        example: '/files/list?size=10',
        description: 'This param specifies the page size.',
      },
      minimum: 1,
    }),
  page: z
    .string()
    .default('0')
    .transform((str, c) => {
      const num = zodStrNumber(str, c);
      if (num < 0)
        c.addIssue({
          message: 'page must be bigger than or equal zero',
          code: 'invalid_string',
          validation: 'regex',
        });
      return num;
    })
    .openapi({
      default: '0',
      type: 'integer',
      param: {
        in: 'query',
        example: '/files/list?page=1',
        description: 'This param specifies the page number.',
      },
      minimum: 0,
    }),
  orderBy: z
    .enum(['size-asc', 'name-asc', 'date-asc', 'size-desc', 'name-desc', 'date-desc'])
    .default('name-asc')
    .openapi({
      default: 'name-asc',
      type: 'string',
      enum: ['size-asc', 'name-asc', 'date-asc', 'size-desc', 'name-desc', 'date-desc'],
      param: {
        in: 'query',
        example: '/files/list?orderBy=size-asc',
        description: 'This param specifies the order criteria.',
      },
    }),
  tags: z
    .union([z.string(), z.string().array()])
    .transform((val) => (val instanceof Array ? val : [val]))
    .optional()
    .openapi({
      param: {
        description: 'Tags that file need to be apart of',
        in: 'query',
      },
    }),
});

export const updateSchema = z.object({
  file: fileSchema.optional().openapi({
    type: 'string',
    description: 'New file content.',
  }),
  name: z.string().optional().openapi({
    description: 'New name for the file.',
  }),
  tags: z
    .union([z.string(), z.string().array()])
    .transform((val) => (val instanceof Array ? val : [val]))
    .optional()
    .openapi({
      description: 'New tags',
    }),
});
