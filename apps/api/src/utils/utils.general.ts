import { File } from 'buffer';
import { getFileEntry } from './utils.db';
import path from 'path';
import { createReadStream } from 'fs';
import { readFile, appendFile } from 'fs/promises';
import type archiver from 'archiver';
import type { Context } from 'hono';
// import sharp from 'sharp';
import { left, right } from 'fp-ts/Either';
import { fileTable, inArray, eq } from 'db';
import { PDFDocument } from 'pdf-lib';
import Ffmpeg from 'fluent-ffmpeg';
import tmp from 'tmp';
import { promisify } from 'util';
import { env } from '@shared/env';

export function createTmpFile(options: tmp.FileOptions = {}) {
  return new Promise<{ name: string; cleanup: () => void }>((res) => {
    tmp.file(options, (_err, name: string, _fd, rm: () => void) => res({ name, cleanup: rm }));
  });
}

export function getFullName(name: string, extension: string) {
  return `${name}${extension}`;
}

export function getFilePath(isPublic: boolean, index: string, extension: string, storeId: string) {
  const storageType = isPublic ? 'public' : 'private';
  return path.join(env.ROOT_DIR, 'storage', storeId, storageType, getFullName(index, extension));
}

export function Uint8ArrayToBuffer(data: Uint8Array) {
  return Buffer.from(data);
}

export function Uint8ArrayToStream(data: Uint8Array) {
  const blob = new Blob([data]);
  return blob.stream();
}

export function bufferToUint8Array(buffer: Buffer) {
  return Uint8Array.from(buffer);
}

export function bufferToFile(buffer: Buffer, fileName: string, type: string) {
  return new File([bufferToUint8Array(buffer)], fileName, { type });
}

export function appendFileToArchive(
  tar: archiver.Archiver,
  file: { extension: string; index: string; isPublic: boolean; name: string; storeId: string },
) {
  const path = getFilePath(file.isPublic, file.index, file.extension, file.storeId);
  tar.append(createReadStream(path), {
    name: getFullName(file.index, file.extension),
  });
}

export async function createSharpInstance(c: Context, storeId: string, id: string) {
  const acceptedFormats = ['.jpeg', '.jpg', '.png', '.avif', '.webp', '.tiff'];

  const fileEntry = await getFileEntry(storeId, id, inArray(fileTable.extension, acceptedFormats));

  if (fileEntry._tag == 'None') return left(c.notFound());

  const path = getFilePath(fileEntry.value.isPublic, fileEntry.value.index, fileEntry.value.extension, storeId);

  return right({ sharp: path, entry: fileEntry.value });
}

export async function createPdfInstance(c: Context, storeId: string, id: string) {
  const entry = await getFileEntry(storeId, id, eq(fileTable.extension, '.pdf'));

  if (entry._tag == 'None') return left(c.notFound());

  const { extension, isPublic, index } = entry.value;

  const filePath = getFilePath(isPublic, index, extension, storeId);
  const arrayBuffer = await Bun.file(filePath).arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  return right({ pdf, entry });
}

export async function getFfmpegFormats() {
  const availableFormatsMap = await promisify(Ffmpeg.getAvailableFormats)();

  return Object.keys(availableFormatsMap).map((format) => `.${format}`);
}

export async function createFfmpegInstance(
  c: Context,
  id: string,
  storeId: string,
  cb: (cmd: Ffmpeg.FfmpegCommand) => Ffmpeg.FfmpegCommand,
  tmpOptions?: tmp.FileOptions,
) {
  const availableFormats = await getFfmpegFormats();

  const entry = await getFileEntry(storeId, id, inArray(fileTable.extension, availableFormats));

  if (entry._tag == 'None') return left(c.notFound());

  const { extension, isPublic, index } = entry.value;

  const filePath = getFilePath(isPublic, index, extension, storeId);

  const ffmpegCmd = Ffmpeg({ source: filePath });

  const { name, cleanup } = await createTmpFile({ postfix: extension, ...tmpOptions });

  const buffer = await new Promise<void>((res, rej) => {
    cb(ffmpegCmd)
      .on('end', () => res())
      .on('error', (err: Error) => rej(new Error(`Error processing video: ${err.message}`)))
      .saveToFile(name);
  }).then(() => {
    const buffer = readFile(name);
    cleanup();
    return buffer;
  });

  return right({ buffer, entry });
}

export function writeToLog(message: string, type: 'ERROR' | 'REQUEST') {
  const logMsg = `Date: ${new Date().toISOString()} , Type: ${type} , Message: ${message} \n\n`;
  const logFilePath = path.join(env.ROOT_DIR, '.log');
  return appendFile(logFilePath, logMsg);
}

export function byteToMega(bytes: number) {
  return bytes / 1000000;
}
