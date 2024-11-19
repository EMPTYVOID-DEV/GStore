import type { AuthorizationBinding } from '@shared/types.global';
import {
  createFileRoute,
  deleteFileRoute,
  listStoreFilesRoute,
  readTagsRoute,
  readFileRoute,
  readStaticRoute,
  updateFileRoute,
} from './files.dal';
import type { RouteHandler } from '@hono/zod-openapi';
import { stream as honoStream } from 'hono/streaming';
import { appendFileToArchive, bufferToUint8Array, getFilePath } from '@utils/utils.general';
import { db } from '@database/db';
import { and, eq, arrayContains, asc, SQL, desc } from 'drizzle-orm';
import { fileTable } from '@database/schema';
import archiver from 'archiver';
import path from 'path';
import { unlink } from 'fs/promises';
import { getFileEntry } from '@utils/utils.db';
import { streamFile, createCustomError, createFile } from '@utils/utils.hono';

export const readStaticHandler: RouteHandler<typeof readStaticRoute> = async (c) => {
  const { index } = c.req.valid('param');
  const entry = await db.query.fileTable.findFirst({ where: and(eq(fileTable.index, index), eq(fileTable.isPublic, true)) });
  if (!entry) return c.notFound();
  const file = Bun.file(getFilePath(true, index, entry.extension, entry.storeId));
  return streamFile(c, file);
};

export const readFileHandler: RouteHandler<typeof readFileRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id } = c.req.valid('param');

  const fileEntry = await getFileEntry(storeId, id);
  if (fileEntry._tag === 'None') return c.notFound();

  const { extension, isPublic, index } = fileEntry.value;
  const filePath = getFilePath(isPublic, index, extension, storeId);
  const file = Bun.file(filePath);
  return streamFile(c, file);
};

export const readTagsHandler: RouteHandler<typeof readTagsRoute, AuthorizationBinding> = async (c) => {
  const { tags } = c.req.valid('query');
  const storeId = c.get('storeId');
  const matchedFiles = await db.query.fileTable.findMany({
    where: and(eq(fileTable.storeId, storeId), arrayContains(fileTable.tags, tags)),
  });

  if (matchedFiles.length === 0) return c.notFound();

  const res = honoStream(c, async (stream) => {
    const tar = archiver('tar', { store: true });
    tar.on('data', (chunk) => stream.write(bufferToUint8Array(chunk)));

    for (const file of matchedFiles) appendFileToArchive(tar, file);

    await tar.finalize();
  });

  res.headers.set('Content-Type', 'application/x-tar');
  return res;
};

export const createFileHandler: RouteHandler<typeof createFileRoute, AuthorizationBinding> = async (c) => {
  const { file, isPublic, tags } = c.req.valid('form');
  const storeId = c.get('storeId');
  return createFile(c, storeId, file, isPublic, tags);
};

export const listStoreFilesHandler: RouteHandler<typeof listStoreFilesRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { page, size, orderBy, tags, extension, name } = c.req.valid('query');
  const orderMap = new Map<typeof orderBy, SQL>([
    ['name-asc', asc(fileTable.name)],
    ['name-desc', desc(fileTable.name)],
    ['size-asc', asc(fileTable.size)],
    ['size-desc', desc(fileTable.size)],
    ['date-asc', asc(fileTable.creationDate)],
    ['date-desc', desc(fileTable.creationDate)],
  ]);

  const filters: SQL[] = [];
  if (name) filters.push(eq(fileTable.name, name));
  if (extension) filters.push(eq(fileTable.extension, extension));
  if (tags) filters.push(arrayContains(fileTable.tags, tags));
  const query = and(eq(fileTable.storeId, storeId), ...filters);

  const files = await db.query.fileTable.findMany({
    where: query,
    limit: size,
    offset: page * size,
    orderBy: [orderMap.get(orderBy)!],
  });
  return c.json(files, 200);
};

export const deleteFileHandler: RouteHandler<typeof deleteFileRoute, AuthorizationBinding> = async (c) => {
  const storeId = c.get('storeId');
  const { id } = c.req.valid('param');

  const deletedEntries = await db
    .delete(fileTable)
    .where(and(eq(fileTable.storeId, storeId), eq(fileTable.id, id)))
    .returning();

  if (deletedEntries.length == 0) return c.notFound();

  const targetEntry = deletedEntries.at(0)!;
  const filePath = getFilePath(targetEntry.isPublic, targetEntry.index, targetEntry.extension, storeId);

  await unlink(filePath);
  return c.json(targetEntry);
};

export const updateFileHandler: RouteHandler<typeof updateFileRoute, AuthorizationBinding> = async (c) => {
  const { id } = c.req.valid('param');
  const { file, tags, name } = c.req.valid('form');
  const storeId = c.get('storeId');

  if (!file && !tags && !name)
    return createCustomError(c, "At least one of 'file' or 'tags' or name must be provided", 'tags or file or name', 'invalid_arguments');

  const wantedFile = await getFileEntry(storeId, id);
  if (wantedFile._tag == 'None') return c.notFound();

  const values = {
    ...wantedFile.value,
  };

  if (name) values.name = name;

  if (tags) values.tags = tags;

  if (file) {
    const { ext } = path.parse(file.name);
    if (wantedFile.value.extension != ext)
      return createCustomError(
        c,
        "You can't update the wanted file with a file that has a different extension",
        'file',
        'invalid_arguments',
      );

    values.size = file.size;
    const filePath = getFilePath(values.isPublic, values.index, values.extension, storeId);
    await Bun.write(filePath, new Response(file.stream()));
  }

  await db
    .update(fileTable)
    .set(values)
    .where(and(eq(fileTable.storeId, storeId), eq(fileTable.id, id)));
  return c.json({ ...values });
};
