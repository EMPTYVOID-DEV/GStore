import { loadJson, validateSchema } from '@shared/utils.js';
import { configSchema } from '@shared/zodSchemas.js';
import type { SyncOptions, ConfigJson } from '@shared/types.js';
import { ActionsExecuter } from '@helpers/actionsExecuter.js';

export async function syncCommand(options: SyncOptions) {
  const config = await loadJson(options.configPath, 'Config');
  const parsedConfig = validateSchema<ConfigJson>(config, configSchema);
  const actionsExecuter = new ActionsExecuter(parsedConfig);
  await actionsExecuter.loadTrackingFile();
  await actionsExecuter.verifyKey();
  await actionsExecuter.fetchApiInfo();
  await actionsExecuter.execute();
  await actionsExecuter.flashTracks();
}
