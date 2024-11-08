import type { Matrix3x3 } from 'sharp';
import { zodErrorSchema } from './schema.global';

export const sepiaMatrix: Matrix3x3 = [
  [0.393, 0.769, 0.189],
  [0.349, 0.686, 0.168],
  [0.272, 0.534, 0.131],
];

export const transformationResponse = {
  200: {
    description: 'Transformation has run successfully',
  },
  404: {
    description: 'Operated file(s) not found',
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
};
