import { Command } from 'commander';
import type { CliOptions } from '@shared/types.js';

export async function cli() {
  const cmd = new Command()
    .name('GStore CLI')
    .description('GStore CLI let you interact with GStore api from the terminal either for backups with cron jobs or devops workflows')
    .requiredOption('-c, --configPath <path>', 'CLI Configuration file path');
  cmd.parse();
  return cmd.opts<CliOptions>();
}
