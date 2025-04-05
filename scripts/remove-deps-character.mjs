import { randomFillSync } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = readdirSync('packages');

for (const packageName of dir) {
  const file = resolve('packages', packageName, 'package.json');
  const content = readFileSync(file, 'utf8');
  writeFileSync(file, content.replaceAll('"workspace:^"', '"workspace:"'));
}
