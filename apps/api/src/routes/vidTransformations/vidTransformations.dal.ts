import { createRoute } from '@hono/zod-openapi';
import getAuthorizationMiddleware from '@middlewares/authorizationMiddleware';
import { transformationResponse } from '@shared/const';
import { singleInputSchema } from '@shared/schema.global';
import { addSubtitleSchema, changeResolutionSchema, convertFormatSchema, trimmingSchema } from './vidTransformations.schema';

export const extractAudioRoute = createRoute({
  tags: ['video transformations'],
  method: 'post',
  path: '/extract-audio',
  responses: transformationResponse,
  request: {
    body: {
      content: {
        'application/json': {
          schema: singleInputSchema,
        },
      },
      required: true,
    },
  },
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This endpoint extracts audio from a video file',
});

export const trimRoute = createRoute({
  tags: ['video transformations'],
  method: 'post',
  path: '/trim',
  responses: transformationResponse,
  request: {
    body: {
      content: {
        'application/json': {
          schema: trimmingSchema,
        },
      },
      required: true,
    },
  },
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This endpoint trim a video file',
});

export const changeResolutionRoute = createRoute({
  tags: ['video transformations'],
  method: 'post',
  path: '/change-resolution',
  responses: transformationResponse,
  request: {
    body: {
      content: {
        'application/json': {
          schema: changeResolutionSchema,
        },
      },
      required: true,
    },
  },
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This endpoint changes the resolution of a video file',
});

export const addSubtitleRoute = createRoute({
  tags: ['video transformations'],
  method: 'post',
  path: '/add-subtitles',
  responses: transformationResponse,
  request: {
    body: {
      content: {
        'application/json': {
          schema: addSubtitleSchema,
        },
      },
      required: true,
    },
  },
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This endpoint adds subtitles to a video file, Th subtitles file must exist in the store',
});

export const convertFormatRoute = createRoute({
  tags: ['video transformations'],
  method: 'post',
  path: '/convert-format',
  responses: transformationResponse,
  request: {
    body: {
      content: {
        'application/json': {
          schema: convertFormatSchema,
        },
      },
      required: true,
    },
  },
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This endpoint converts a video format to another.',
});
