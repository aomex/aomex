import { readFileSync, writeFileSync } from 'fs';
import assert from 'node:assert';
import path from 'path';
import { readPackageUpSync } from 'read-package-up';

const version = readPackageUpSync()?.packageJson.version || '0.0.0';
const file = path.resolve('dist/index.js');

let content = readFileSync(file, 'utf8');
assert(content.includes('{{#version}}'));
content = content.replaceAll('{{#version}}', version);
writeFileSync(file, content);
assert(content.includes(version));
