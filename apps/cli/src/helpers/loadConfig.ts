import { logger } from '@shared/utils';

export async function loadConfig(configPath: string): Promise<Record<string, unknown>> {
  const configFile = Bun.file(configPath);
  const configContent = await configFile.text();
  try {
    return JSON.parse(configContent);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    logger().error('Error occured while parsing the config');
    process.exit(1);
  }
}
