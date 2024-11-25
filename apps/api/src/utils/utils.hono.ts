import { db, and, eq, fileTable } from 'db';
import type { z } from '@hono/zod-openapi';
import type { outputMethod } from '@shared/schema.global';
import type { Context } from 'hono';
import { File } from 'buffer';
import { stream as honoStream } from 'hono/streaming';
import { nanoid } from 'nanoid';
import { getFileEntry } from './utils.db';
import { getFilePath, getFullName, bufferToFile, byteToMega } from './utils.general';
import path from 'path';
import { getMimeType } from 'hono/utils/mime';
import { env } from '@shared/env';

export function createCustomError(c: Context, message: string, field: string, reason: string) {
  return c.json(
    {
      success: false,
      errors: [
        {
          message,
          field,
          reason,
        },
      ],
    },
    400,
  );
}

export async function streamFile(c: Context, file: { stream: () => ReadableStream; type: string }) {
  const res = honoStream(c, async (stream) => await stream.pipe(file.stream()));
  res.headers.set('Content-Type', file.type);
  return res;
}

export async function createFile(c: Context, storeId: string, file: File, isPublic: boolean, tags: string[]) {
  const { name, ext } = path.parse(file.name);
  const index = nanoid(32);
  const filePath = getFilePath(isPublic, index, ext, storeId);

  const res = await Promise.allSettled([
    Bun.write(filePath, new Response(file.stream())),
    db
      .insert(fileTable)
      .values({
        name,
        size: file.size,
        extension: ext,
        isPublic,
        index,
        storeId,
        tags,
      })
      .returning(),
  ]);

  if (res[0].status == 'rejected' || res[1].status == 'rejected') return c.text('Service Unavailable', 500);

  return c.json(res[1].value[0]);
}

async function handleTransformationUpdate(c: Context, storeId: string, id: string, file: File, ext: string) {
  const entry = await getFileEntry(storeId, id);

  if (entry._tag == 'None') return c.notFound();

  if (entry.value.extension != ext)
    return createCustomError(
      c,
      "The extension of transformation result and updated file don't match",
      'outputMethod.id',
      'invalid_arguments',
    );

  const filePath = getFilePath(entry.value.isPublic, entry.value.index, entry.value.extension, storeId);

  const res = await Promise.allSettled([
    Bun.write(filePath, new Response(file.stream())),
    db
      .update(fileTable)
      .set({ size: file.size })
      .where(and(eq(fileTable.storeId, storeId), eq(fileTable.id, id)))
      .returning(),
  ]);
  if (res[0].status == 'rejected' || res[1].status == 'rejected') return c.text('Service Unavailable', 500);

  return c.json(res[1].value);
}

export async function handleTransformationOutput(
  c: Context,
  storeId: string,
  data: Buffer,
  ext: string,
  method: z.infer<typeof outputMethod>,
) {
  const filename = method.type == 'create' ? getFullName(method.metaData.name, ext) : getFullName('result', ext);
  const file = bufferToFile(data, filename, getMimeType(ext)!);
  if (method.type == 'return') return streamFile(c, file);
  if (byteToMega(file.size) > env.MAX_FILE_SIZE)
    return createCustomError(c, `The output has exceeded the Size limits ${env.MAX_FILE_SIZE} mb`, 'output', 'custom');
  if (method.type == 'update') return handleTransformationUpdate(c, storeId, method.id, file, ext);
  return createFile(c, storeId, file, method.metaData.isPublic, method.metaData.tags);
}
