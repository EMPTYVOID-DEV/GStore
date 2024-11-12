import { createRoute } from '@hono/zod-openapi';
import { singleInputSchema } from '@shared/schema.global';
import getAuthorizationMiddleware from '@middlewares/authorizationMiddleware';
import {
  blurSchema,
  compressionSchema,
  contrastSchema,
  formatConversionSchema,
  modulateSchema,
  resizeSchema,
  sharpenSchema,
} from './imgTransformations.schema';
import { transformationResponse } from '@shared/const';

export const conversionRoute = createRoute({
  tags: ['image transformations'],
  method: 'post',
  path: '/conversion',
  request: {
    body: {
      content: {
        'application/json': {
          schema: formatConversionSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: 'This endpoint apply image format conversion.',
});

export const resizeRoute = createRoute({
  tags: ['image transformations'],
  method: 'post',
  path: '/resize',
  request: {
    body: {
      content: {
        'application/json': {
          schema: resizeSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint apply resizing on chosen image.`,
});

export const compressionRoute = createRoute({
  tags: ['image transformations'],
  path: '/compression',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: compressionSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint applies compression to an image`,
});

export const blurRoute = createRoute({
  tags: ['image transformations'],
  path: '/blur',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: blurSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint applies blur to an image`,
});

export const sharpenRoute = createRoute({
  tags: ['image transformations'],
  path: '/sharpen',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: sharpenSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint applies sharpening to an image`,
});

export const modulateRoute = createRoute({
  tags: ['image transformations'],
  path: '/modulate',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: modulateSchema,
        },
      },
      required: true,
    },
  },
  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint modulate hue,saturation,lightness and brightness of an image`,
});

export const sepiaRoute = createRoute({
  tags: ['image transformations'],
  path: '/sepia',
  method: 'post',
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

  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint applies sepia to an image`,
});

export const grayscaleRoute = createRoute({
  tags: ['image transformations'],
  path: '/grayscale',
  method: 'post',
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

  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint applies grayscale to an image`,
});

export const invertRoute = createRoute({
  tags: ['image transformations'],
  path: '/invert',
  method: 'post',
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

  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint invert the colors of an image`,
});

export const contrastRoute = createRoute({
  tags: ['image transformations'],
  path: '/contrast',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: contrastSchema,
        },
      },
      required: true,
    },
  },

  responses: transformationResponse,
  middleware: [getAuthorizationMiddleware('apply-transformation')],
  description: `This endpoint applies contrast to an image`,
});
