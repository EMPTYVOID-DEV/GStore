import { generateSchemaCommand } from '@commands/generateSchema';
import { syncCommand } from '@commands/sync';
import type { CommandName, SyncOptions } from '@shared/types';
import { errorExit } from '@shared/utils';
import { Command } from 'commander';

export async function main() {
  const program = new Command();

  const generateSchema = new Command('generate-schema').description(
    'Generate schema command is used to generate json schema for both config and tracking files',
  );

  const sync = new Command('sync')
    .description('Sync command will execute the actions in the config file.')
    .requiredOption('-c, --configPath <path>', 'CLI Configuration file path');

  program.addCommand(generateSchema);

  program.addCommand(sync);

  const parsed = program.parse();

  const commandName = parsed.args[0] as CommandName;

  if (commandName == 'generate-schema') await generateSchemaCommand();
  else if (commandName == 'sync') {
    const syncOptions = sync.opts<SyncOptions>();
    await syncCommand(syncOptions);
  }
}

main()
  .catch(() => errorExit('Something went wrong'))
  .then(() => {
    process.exit(0);
  });
