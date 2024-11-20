#! /usr/bin/env bun
import { logger } from '@utils/general.js';
import { cli } from '@helpers/cli.js';
import { loadConfig } from '@helpers/loadConfig';

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
  console.log(config);
}

main().catch((err: Error) => {
  logger().error(err.message);
});
