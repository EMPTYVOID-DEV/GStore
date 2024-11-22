import { configSchema, tracksSchema } from '../shared/zodSchemas.js';
import path from 'path';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fsExtra from 'fs-extra';

export async function createConfigSchema() {
  const configJsonSchema = zodToJsonSchema(configSchema, 'Config json file schema');
  const schemaPath = path.join(process.cwd(), 'config.schema.json');
  await fsExtra.writeFile(schemaPath, JSON.stringify(configJsonSchema));
}

export async function createTracksSchema() {
  const tracksJsonSchema = zodToJsonSchema(tracksSchema, 'Tracking json file schema');
  const schemaPath = path.join(process.cwd(), 'tracking.schema.json');
  await fsExtra.writeFile(schemaPath, JSON.stringify(tracksJsonSchema));
}
