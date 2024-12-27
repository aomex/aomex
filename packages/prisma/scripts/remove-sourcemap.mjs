import { rmSync, writeFileSync } from 'fs';

rmSync('./dist/index.js.map');
writeFileSync('./dist/index.js', '');
