#!/usr/bin/env -S ts-node-esm --transpileOnly --experimentalSpecifierResolution=node

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync, statSync, writeFileSync } from 'node:fs';
import { hideBin } from 'yargs/helpers';
import { chalk, fileToModules, pathToFiles } from '@aomex/utility';
import type { Config } from './define-config';

{
  const defaultConfig: Config = {
    cliEntry: {
      production: './src/cli.js',
      default: './src/cli.ts',
    },
  };

  const args = hideBin(process.argv);
  if (args.length === 1 && args[0] === '--init') {
    const file = path.resolve('aomex.config.ts');

    if (existsSync(file)) {
      console.warn(
        chalk.yellow('Your configuration file had been generated already!'),
      );
      process.exit(0);
    }

    writeFileSync(
      file,
      `import { defineConfig } from '@aomex/console';

export default defineConfig(${JSON.stringify(defaultConfig, null, 2)});
`,
    );
    console.info(
      'Configuration file has been generated successfully: ' +
        chalk.blueBright(file),
    );
    process.exit(0);
  }
}

const env = process.env['NODE_ENV'] || 'development';
const parseEnv = (config: any) => {
  if (!config) return null;
  if (Object.hasOwn(config, env)) return config[env];
  if (Object.hasOwn(config, 'default')) return config['default'];
  return null;
};

const files = await pathToFiles('./aomex.config{.ts,.js}');
let config: Config | undefined;

for (const file of files) {
  const configs = await fileToModules<Config>(
    [file],
    (item) => typeof item === 'object',
  );
  if (configs.length) {
    config = configs[0]!;
    break;
  }
}

if (!config) {
  console.error(
    `Aomex doesn't find a configuration file matched pattern "aomex.config.{ts|js}", would you please execute the initialize command below at first?\n\n${chalk.greenBright(
      'npx aomex --init',
    )}\n`,
  );
  process.exit(1);
}

let cliEntry: string = parseEnv(config.cliEntry) || '';
if (cliEntry) {
  cliEntry = path.resolve(cliEntry);
}
if (!cliEntry || !statSync(cliEntry).isFile()) {
  console.error(`The given entry file "${cliEntry}" is not found`);
  process.exit(1);
}
await import(pathToFileURL(cliEntry).toString());
