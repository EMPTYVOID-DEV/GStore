import chalk from 'chalk';
import type { ZodError, ZodSchema } from 'zod';
import fsExtra from 'fs-extra';
import path from 'path';
import mime from 'mime-types';

export function logger() {
  return {
    info: (message: string) => {
      console.log(chalk.blueBright(message), '\n');
    },
    success: (message: string) => {
      console.log(chalk.greenBright(message), '\n');
    },
    error: (message: string) => {
      console.log(chalk.redBright(message), '\n');
    },
  };
}

export function errorExit(message: string) {
  logger().error(message);
  process.exit(1);
}

export function validateSchema<A extends Record<string, unknown>>(record: Record<string, unknown>, schema: ZodSchema): A {
  try {
    const parsedBody = schema.parse(record);
    return parsedBody;
  } catch (error) {
    const errorMessage = (error as ZodError).errors.map((issue) => `Message: ${issue.message} path: ${issue.path.join(',')}`).join('\n');
    logger().error(errorMessage);
    process.exit(1);
  }
}

export function byteToMega(bytes: number) {
  return bytes / 1000000;
}

export async function loadJson(path: string, name: string): Promise<Record<string, unknown>> {
  const exists = await fsExtra.exists(path);
  if (!exists) errorExit(`${name} file does not exit`);
  const buffer = await fsExtra.readFile(path);
  const content = buffer.toString();
  try {
    return JSON.parse(content);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    logger().error(`Error occured while parsing the ${name} file`);
    process.exit(1);
  }
}

export function bufferToUint8Array(buffer: Buffer) {
  return Uint8Array.from(buffer);
}

export async function pathToFile(path: string, fileName: string, type: string) {
  const buffer = await fsExtra.readFile(path);
  return new File([bufferToUint8Array(buffer)], fileName, { type });
}
export async function getFileInfo(filePath: string) {
  const stat = await fsExtra.stat(filePath);
  const fileName = path.basename(filePath);
  const fileExtension = path.extname(filePath).toLowerCase();
  const mimeType = mime.lookup(filePath) || 'unknown';

  return {
    fileName,
    fileExtension,
    mimeType,
    size: stat.size,
  };
}
