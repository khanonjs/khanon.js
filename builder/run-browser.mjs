import { exec } from 'child_process';
import chalk from 'chalk'

export const runBrowser = (port) => {
  const url = `http://localhost:${port}`;
  console.log(chalk.green(`Serving on ${url}`));

  const platform = process.platform;
  let command = '';
  if (platform === 'darwin') command = `open ${url}`;            // macOS
  else if (platform === 'win32') command = `start ${url}`;       // Windows
  else if (platform === 'linux') command = `xdg-open ${url}`;    // Linux

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`Error: ${err}`));
      return;
    }
    console.log(stdout);
  });
}