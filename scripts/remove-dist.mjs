import { existsSync, readdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';

const packages = readdirSync('./packages');

for (const packageDir of packages) {
  const dist = `./packages/${packageDir}/dist`;
  if (existsSync(dist)) {
    await rm(dist, { recursive: true, force: true });
  }
}
