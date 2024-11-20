import chalk from 'chalk';

export function logger() {
  return {
    info: (message: string) => {
      console.log(chalk.blueBright(message));
    },
    success: (message: string) => {
      console.log(chalk.greenBright(message));
    },
    error: (message: string) => {
      console.log(chalk.redBright(message));
    },
  };
}
