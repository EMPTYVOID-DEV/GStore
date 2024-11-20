#! /usr/bin/env bun
import { logger, validateSchema } from '@utils/general.js';
import { cli } from '@helpers/cli.js';
import { loadConfig } from '@helpers/loadConfig';
import { configSchema } from '@shared/zodSchemas';
import type { Config } from '@shared/types';

/**
 * cli
 * loading config
 * validating config
 * validating api key
 * showing api limits
 * exectuting actions
 */

async function main() {
  const options = await cli();
  const config = await loadConfig(options.config);
  const parsedConfig = validateSchema<Config>(config, configSchema);
  console.log(parsedConfig);
}

main().catch((err: Error) => {
  logger().error(err.message);
});
