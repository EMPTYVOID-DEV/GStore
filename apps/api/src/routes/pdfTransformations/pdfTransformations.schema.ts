import { z } from '@hono/zod-openapi';
import { idSchema, outputMethod, singleInputSchema } from '@shared/schema.global';

export const mergeSchema = z.object({
  pdfIdList: idSchema
    .array()
    .min(2, { message: 'At least two pdf files to merge' })
    .refine((list) => new Set(list).size == list.length, { message: "The list can't have duplicate ids" })
    .openapi({ description: 'Ids list of pdf files we need to merge.', type: 'array' }),
  outputMethod: outputMethod,
});

export const extractPagesSchema = z
  .object({
    pages: z.discriminatedUnion('type', [
      z.object({
        type: z.literal('range').openapi({ description: 'Range type let you extract pages between max and min' }),
        max: z.number().min(0),
        min: z.number().min(0),
      }),
      z.object({
        type: z.literal('list').openapi({ description: 'List type let you specify the exact pages to extract.' }),
        list: z.number().array().nonempty(),
      }),
    ]),
  })
  .and(singleInputSchema)
  .transform(({ pages, id, outputMethod }, c) => {
    let pagesIndicies;
    if (pages.type == 'list') {
      pagesIndicies = pages.list.toSorted((a, b) => a - b);
      if (pagesIndicies[0] < 0) c.addIssue({ message: 'Page index minimum value is 0', code: 'custom' });
    } else {
      if (pages.max < pages.min) c.addIssue({ message: 'Max must be greater than min', code: 'custom' });
      pagesIndicies = Array.from({ length: pages.max - pages.min + 1 }, (_, i) => pages.min + i);
    }

    return { pagesIndicies, id, outputMethod };
  });

export const readMetaSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  subject: z.string().optional(),
  creationDate: z.string().optional(),
  modificationDate: z.string().optional(),
  keywords: z.string().array().optional(),
  pageCount: z.string(),
});

export const setMetaSchema = readMetaSchema
  .omit({ pageCount: true, creationDate: true, modificationDate: true })
  .and(singleInputSchema.omit({ outputMethod: true }));

export const addAttachmentSchema = z
  .object({
    attachmentId: idSchema.openapi({ description: 'The attachement id' }),
    name: z.string().openapi({ description: 'Attachment name' }),
    type: z.string().optional().openapi({ description: 'Attachment mime type' }),
    description: z.string().optional().openapi({ description: 'The attachment description' }),
  })
  .and(singleInputSchema);
