import { createConfigSchema, createTracksSchema } from '@helpers/createJsonSchema.js';
import { logger } from '@shared/utils.js';

export async function generateSchemaCommand() {
  logger().info('Generating schema for config json');
  await createConfigSchema();
  logger().info('Generating schema for tracking json');
  await createTracksSchema();
}
