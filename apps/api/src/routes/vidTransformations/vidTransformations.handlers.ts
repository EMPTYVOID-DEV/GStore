import type { RouteHandler } from '@hono/zod-openapi';
import type { addSubtitleRoute, changeResolutionRoute, convertFormatRoute, extractAudioRoute, trimRoute } from './vidTransformations.dal';
import type { AuthorizationBinding } from '@shared/types.global';
import { createFfmpegInstance, getFilePath } from '@utils/utils.general';
import { handleTransformationOutput } from '@utils/utils.hono';
import { getFileEntry } from '@utils/utils.db';
import { inArray } from 'drizzle-orm';
import { fileTable } from '@database/schema';

export const extractAudioHandler: RouteHandler<typeof extractAudioRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod } = c.req.valid('json');
  const ffmpegResult = await createFfmpegInstance(c, id, storeId, (cmd) => cmd.noVideo().format('mp3'), { postfix: '.mp3' });

  if (ffmpegResult._tag == 'Left') return ffmpegResult.left;

  return handleTransformationOutput(c, storeId, ffmpegResult.right.buffer, '.mp3', outputMethod);
};

export const trimHandler: RouteHandler<typeof trimRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod, duration, start } = c.req.valid('json');

  const ffmpegResult = await createFfmpegInstance(c, id, storeId, (cmd) =>
    cmd.inputOptions([`-ss ${start}`]).outputOptions([`-t ${duration}`, '-c:v copy', '-c:a copy']),
  );

  if (ffmpegResult._tag == 'Left') return ffmpegResult.left;

  return handleTransformationOutput(c, storeId, ffmpegResult.right.buffer, ffmpegResult.right.entry.value.extension, outputMethod);
};

export const changeResolutionHandler: RouteHandler<typeof changeResolutionRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod, height, width } = c.req.valid('json');

  const ffmpegResult = await createFfmpegInstance(c, id, storeId, (cmd) => cmd.videoFilters(`scale=${width}:${height}`));

  if (ffmpegResult._tag == 'Left') return ffmpegResult.left;

  return handleTransformationOutput(c, storeId, ffmpegResult.right.buffer, ffmpegResult.right.entry.value.extension, outputMethod);
};

export const addSubtitlesHandler: RouteHandler<typeof addSubtitleRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod, subtitlesId } = c.req.valid('json');
  const subtitlesExtensions = ['.srt', '.ass', '.ssa'];

  const subtitlesEntry = await getFileEntry(storeId, subtitlesId, inArray(fileTable.extension, subtitlesExtensions));

  if (subtitlesEntry._tag == 'None') return c.notFound();

  const subtitlesPath = getFilePath(subtitlesEntry.value.isPublic, subtitlesEntry.value.index, subtitlesEntry.value.extension, storeId);

  const ffmpegResult = await createFfmpegInstance(c, id, storeId, (cmd) =>
    cmd.inputOption('-i', subtitlesPath).videoFilters([
      {
        filter: 'subtitles',
        options: { filename: subtitlesPath },
      },
    ]),
  );

  if (ffmpegResult._tag == 'Left') return ffmpegResult.left;

  return handleTransformationOutput(c, storeId, ffmpegResult.right.buffer, ffmpegResult.right.entry.value.extension, outputMethod);
};

export const convertFormatHandler: RouteHandler<typeof convertFormatRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id, outputMethod, targetFormat } = c.req.valid('json');

  const ffmpegResult = await createFfmpegInstance(c, id, storeId, (cmd) => cmd.toFormat(targetFormat.slice(1)), { postfix: targetFormat });

  if (ffmpegResult._tag == 'Left') return ffmpegResult.left;

  return handleTransformationOutput(c, storeId, ffmpegResult.right.buffer, targetFormat, outputMethod);
};
