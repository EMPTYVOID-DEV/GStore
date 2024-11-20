#! /usr/bin/env bun
import { errorExit, validateSchema } from '@utils/general.js';
import { cli } from '@helpers/cli.js';
import { loadConfig } from '@helpers/loadConfig';
import { configSchema } from '@shared/zodSchemas';
import type { Config } from '@shared/types';
import { ActionsExecuter } from '@helpers/actionsExecuter';
import { getApiInfo } from '@helpers/getApiInfo';

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
  const actionsExecuter = new ActionsExecuter(parsedConfig);
  await actionsExecuter.verifyKey();
  await getApiInfo(parsedConfig.host);
}

main().catch(() => errorExit('Something went wrong'));
