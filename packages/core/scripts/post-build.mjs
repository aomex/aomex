import { readFileSync, writeFileSync } from 'fs';

{
  const file = 'dist/index.d.ts';
  const content = readFileSync(file, 'utf8');
  writeFileSync(
    file,
    content.replaceAll(/declare module '\..+?' {\n\s*([\s\S]+?)\n}/g, 'declare $1'),
  );
}
