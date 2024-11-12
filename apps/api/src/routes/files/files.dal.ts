import { createRoute } from '@hono/zod-openapi';
import { createSchema, listSchema, readTagsSchema, updateSchema, indexParamSchema } from './files.schema';
import getAuthorizationMiddleware from '@middlewares/authorizationMiddleware';
import { idParamSchema, zodErrorSchema } from '@shared/schema.global';
import { fileTable } from '@database/schema';
import { createInsertSchema } from 'drizzle-zod';

export const readStaticRoute = createRoute({
  tags: ['public'],
  method: 'get',
  path: '/public/{index}',
  request: {
    params: indexParamSchema,
  },
  responses: {
    200: {
      description: 'File streamed to the user successfully',
    },
    404: {
      description: 'File not found',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid request parameters',
    },
  },
  description: 'Streams the content of a public file identified by the index (this includes file extension).',
});

export const readFileRoute = createRoute({
  tags: ['files'],
  method: 'get',
  path: '/read/{id}',
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'File streamed to the user successfully',
    },
    404: {
      description: 'File not found',
    },
    403: {
      description: 'Authorization failed',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid request parameters',
    },
  },
  middleware: [getAuthorizationMiddleware('read')],
  description: 'Streams the content of a file from the store based on the provided file ID.',
});

export const readTagsRoute = createRoute({
  tags: ['files'],
  method: 'get',
  path: '/readTags',
  request: {
    query: readTagsSchema,
  },
  responses: {
    200: {
      description: 'TAR archive of files with matching tags streamed successfully',
    },
    404: {
      description: 'No files found with all requested tags',
    },
    403: {
      description: 'Authorization failed',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid query parameters',
    },
  },
  middleware: [getAuthorizationMiddleware('read')],
  description:
    'Streams a TAR archive containing files from the store that match all specified tags , File names in the archive are set to their index to prevent overwriting.',
});

export const createFileRoute = createRoute({
  tags: ['files'],
  method: 'post',
  path: '/create',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: createSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Api returns created file',
      content: {
        'application/json': {
          schema: createInsertSchema(fileTable),
        },
      },
    },
    403: {
      description: 'Authorization failed',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid form data',
    },
  },
  middleware: [getAuthorizationMiddleware('create')],
  description: 'Creates a new file in the store using the provided form data.',
});

export const listStoreFilesRoute = createRoute({
  tags: ['files'],
  method: 'get',
  path: '/list',
  request: {
    query: listSchema,
  },
  responses: {
    200: {
      description: 'Api returns queried files',
      content: {
        'application/json': {
          schema: createInsertSchema(fileTable).array(),
        },
      },
    },
    403: {
      description: 'Authorization failed',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid query parameters',
    },
  },
  middleware: [getAuthorizationMiddleware('list-files')],
  description: 'Retrieves a paginated list of file metadata from the store.',
});

export const deleteFileRoute = createRoute({
  tags: ['files'],
  method: 'delete',
  path: '/delete/{id}',
  request: {
    params: idParamSchema,
  },
  responses: {
    200: {
      description: 'Api returns deleted file.',
      content: {
        'application/json': {
          schema: createInsertSchema(fileTable),
        },
      },
    },
    403: {
      description: 'Authorization failed',
    },
    404: {
      description: 'File not found',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid request parameters',
    },
  },
  middleware: [getAuthorizationMiddleware('delete')],
  description: 'Deletes a file in the store.',
});

export const updateFileRoute = createRoute({
  tags: ['files'],
  method: 'put',
  path: '/update/{id}',
  request: {
    params: idParamSchema,
    body: {
      content: {
        'multipart/form-data': {
          schema: updateSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Api returns the updated file',
      content: {
        'application/json': {
          schema: createInsertSchema(fileTable),
        },
      },
    },
    403: {
      description: 'Authorization failed',
    },
    404: {
      description: 'File not found',
    },
    400: {
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
      description: 'Invalid request parameters',
    },
  },
  middleware: [getAuthorizationMiddleware('update')],
  description:
    'Update the file content , name and tags ,every input is optional. The file name is separated than the file content because you can update the name not the content ',
});
