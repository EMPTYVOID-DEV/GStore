import { createConfigSchema, createTracksSchema } from '../helpers/createJsonSchema';
import { logger } from '../shared/utils';

export async function generateSchemaCommand() {
  logger().info('Generating schema for config json');
  await createConfigSchema();
  logger().info('Generating schema for tracking json');
  await createTracksSchema();
}
