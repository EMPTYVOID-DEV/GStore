import { idSchema, singleInputSchema } from '@shared/schema.global';
import { z } from '@hono/zod-openapi';
import { getFfmpegFormats } from '@utils/utils.general';

export const trimmingSchema = z
  .object({
    start: z.number().min(0).openapi({ description: 'Trim start in seconds' }),
    duration: z.number().min(0).openapi({ description: 'Trim duration in seconds ' }),
  })
  .and(singleInputSchema);

export const changeResolutionSchema = z
  .object({
    width: z.number().min(50).max(1080).openapi({ description: 'Width of output video' }),
    height: z.number().min(50).max(1080).openapi({ description: 'Height of output video' }),
  })
  .and(singleInputSchema);

export const addSubtitleSchema = z
  .object({
    subtitlesId: idSchema.openapi({ description: 'The id of subtitle file must have one of these extensions .srt .ass .ssa' }),
  })
  .and(singleInputSchema);

export const convertFormatSchema = z
  .object({
    targetFormat: z
      .string()
      .refine(
        async (format) => {
          const ffmpegFormats = await getFfmpegFormats();
          return ffmpegFormats.includes(format);
        },
        { message: 'Format must be a video format, must start with . ' },
      )
      .openapi({ description: 'This is the format of output video, must start with . ' }),
  })
  .and(singleInputSchema);
