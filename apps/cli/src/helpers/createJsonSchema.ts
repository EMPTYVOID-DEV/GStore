import { configSchema, tracksSchema } from '@shared/zodSchemas';
import path from 'path';
import zodToJson from 'zod-to-json-schema';

export async function createConfigSchema() {
  const configJsonSchema = zodToJson(configSchema, 'Config json file schema');
  const schemaPath = path.join(process.cwd(), 'config.schema.json');
  Bun.write(schemaPath, JSON.stringify(configJsonSchema));
}

export async function createTracksSchema() {
  const configJsonSchema = zodToJson(tracksSchema, 'Tracking json file schema');
  const schemaPath = path.join(process.cwd(), 'tracking.schema.json');
  Bun.write(schemaPath, JSON.stringify(configJsonSchema));
}
