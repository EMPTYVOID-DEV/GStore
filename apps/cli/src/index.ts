#! /usr/bin/env bun
import { errorExit, validateSchema } from '@shared/utils.js';
import { cli } from '@helpers/cli.js';
import { loadConfig } from '@helpers/loadConfig';
import { configSchema } from '@shared/zodSchemas';
import type { Config } from '@shared/types';
import { ActionsExecuter } from '@helpers/actionsExecuter';

async function main() {
  const options = await cli();
  const config = await loadConfig(options.configPath);
  const parsedConfig = validateSchema<Config>(config, configSchema);
  const actionsExecuter = new ActionsExecuter(parsedConfig);
  await actionsExecuter.verifyKey();
  await actionsExecuter.fetchApiInfo();
  await actionsExecuter.execute();
}

main()
  .catch(() => errorExit('Something went wrong'))
  .then(() => {
    process.exit(0);
  });
