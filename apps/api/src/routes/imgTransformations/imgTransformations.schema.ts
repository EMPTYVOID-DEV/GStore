import { z } from '@hono/zod-openapi';
import { singleInputSchema } from '@shared/schema.global';

export const formatConversionSchema = z
  .object({
    targetFormat: z
      .enum(['.jpeg', '.jpg', '.png', '.avif', '.webp', '.tiff'])
      .openapi({ description: 'The wanted image format', type: 'string' }),
  })
  .and(singleInputSchema);

export const resizeSchema = z
  .object({
    width: z.number().min(50).openapi({ description: 'New image width in pixels' }),
    height: z.number().min(50).openapi({ description: 'New image height in pixels' }),
    fit: z
      .enum(['cover', 'contain', 'fill'])
      .default('cover')
      .openapi({ description: 'Fit specifies how the image fit the new dimensions' }),
    position: z
      .enum(['top', 'right top', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top', 'center'])
      .default('center')
      .openapi({
        description:
          'Position either means what part of the image to show when we use cover and fill or we put the image when we use contain',
      }),
  })
  .and(singleInputSchema);

export const compressionSchema = z
  .object({ quality: z.number().min(1).max(100).openapi({ description: 'This determines compression level' }) })
  .and(singleInputSchema);

export const sharpenSchema = z
  .object({
    sigma: z.number().min(0.000001).max(10).openapi({ description: 'This controls the level of sharpening' }),
  })
  .and(singleInputSchema);

export const blurSchema = z
  .object({
    sigma: z.number().min(0.3).max(1000).openapi({ description: 'This controls the level of blur' }),
  })
  .and(singleInputSchema);

export const modulateSchema = z
  .object({
    hue: z.number().int().min(0).max(360).optional().openapi({ description: 'This controls hue of image pixels.' }),
    saturation: z.number().optional().openapi({ description: 'This controls saturation of image pixels.' }),
    lightness: z.number().optional().openapi({ description: 'This controls lightness of image pixels.' }),
    brightness: z.number().optional().openapi({ description: 'This controls brightness of image pixels.' }),
  })
  .and(singleInputSchema);

export const contrastSchema = z
  .object({
    lower: z.number().min(1).max(99).openapi({
      description: 'Pixels with luminance values below this value (underexposed) are clipped to zero, making them completely black.',
    }),
    upper: z.number().min(1).max(99).openapi({
      description:
        'Pixels with luminance values above this value (overexposed) are clipped to the maximum pixel value, making them completely white.',
    }),
  })
  .and(singleInputSchema);
