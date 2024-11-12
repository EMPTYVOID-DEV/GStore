import { createRoute } from '@hono/zod-openapi';
import { addAttachmentSchema, extractPagesSchema, mergeSchema, readMetaSchema, setMetaSchema } from './pdfTransformations.schema';
import getAuthorizationMiddleware from '@middlewares/authorizationMiddleware';
import { transformationResponse } from '@shared/const';
import { idParamSchema } from '@shared/schema.global';

export const mergeRoute = createRoute({
  tags: ['pdf transformations'],
  method: 'post',
  path: '/merge',
  request: {
    body: {
      content: {
        'application/json': {
          schema: mergeSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This route take a list of pdf files ids then merge them to one.',
});

export const extractPagesRoute = createRoute({
  tags: ['pdf transformations'],
  method: 'post',
  path: '/extract-pages',
  request: {
    body: {
      content: {
        'application/json': {
          schema: extractPagesSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This route creates a pdf with subset of the pages of another pdf.',
});

export const readMetaRoute = createRoute({
  tags: ['pdf transformations'],
  method: 'get',
  path: '/readMeta/{id}',
  request: {
    params: idParamSchema,
  },
  responses: {
    ...transformationResponse,
    200: {
      description: 'The meta data returned successfully',
      content: {
        'application/json': {
          schema: readMetaSchema,
        },
      },
    },
  },
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This route let you read the meta data of pdf file',
});

export const setMetaRoute = createRoute({
  tags: ['pdf transformations'],
  method: 'post',
  path: '/setMeta',
  request: {
    body: {
      content: {
        'application/json': {
          schema: setMetaSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This route let you set the meta data of pdf file',
});

export const addAttachmentRoute = createRoute({
  tags: ['pdf transformations'],
  method: 'post',
  path: '/attach',
  request: {
    body: {
      content: {
        'application/json': {
          schema: addAttachmentSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This route let you add an attachment to a pdf file',
});
