import { createRoute } from '@hono/zod-openapi';
import { createSchema } from './store.schema';
import { selectStoreSchema } from 'db';
import { idParamSchema, zodErrorSchema } from '@shared/schema.global';

export const createStoreRoute = createRoute({
  method: 'post',
  path: '/create',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'The store is created successfully',
      content: {
        'application/json': {
          schema: selectStoreSchema.pick({ id: true }),
        },
      },
    },
    401: {
      description: 'The user with the given id does not exist',
    },
    403: {
      description: 'Unique store name per user has been violated',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid json data',
    },
  },
  tags: ['stores'],
  description: 'This endpoint is  used by the central app to create a store for an existing user',
});

export const deleteStoreRoute = createRoute({
  method: 'delete',
  path: '/delete/{id}',
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'The store is deleted successfully',
      content: {
        'application/json': {
          schema: selectStoreSchema,
        },
      },
    },
    401: {
      description: 'The store with the given id does not exist',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid search params',
    },
  },
  tags: ['stores'],
  description: 'This endpoint is used by the central app to delete a store. ',
});
