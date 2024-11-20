import chalk from 'chalk';
import type { ZodError, ZodSchema } from 'zod';

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
