import { apiKeyTable } from '@database/schema';
import { createRoute } from '@hono/zod-openapi';
import { envSchema } from '@shared/env';
import { createSelectSchema } from 'drizzle-zod';
import { keyInfoSchema } from './info.schema';

export const apiInfoRoute = createRoute({
  method: 'get',
  path: '/api-info',
  responses: {
    200: {
      description: 'Returning the api the informations',
      content: { 'application/json': { schema: envSchema.omit({ DB_URL: true, PORT: true, NODE_ENV: true, ROOT_DIR: true }) } },
    },
  },
  tags: ['public'],
  description: 'This endpoint returns public informations about the api. ',
});

export const keyInfoRoute = createRoute({
  method: 'get',
  path: '/key-info/{key}',
  request: { params: keyInfoSchema },
  responses: {
    200: {
      description: 'Returning the api the informations',
      content: {
        'application/json': {
          schema: createSelectSchema(apiKeyTable),
        },
      },
    },
    404: { description: 'Api key not found' },
  },
  tags: ['public'],
  description: 'This endpoint returns public informations about the api like max_file_size,rate_limiting_,ver. ',
});
