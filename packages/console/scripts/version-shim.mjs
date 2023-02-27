import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { readPackageUpSync } from 'read-pkg-up';

const version = readPackageUpSync()?.packageJson.version || '0.0.0';
const file = path.resolve('dist/index.js');
const content = readFileSync(file, 'utf8');

writeFileSync(file, content.replaceAll('{{#version}}', version));
