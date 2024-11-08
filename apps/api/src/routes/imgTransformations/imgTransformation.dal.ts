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
