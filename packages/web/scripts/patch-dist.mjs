import assert from 'node:assert';
import fs from 'node:fs';

{
  const dtsFile = './dist/index.d.ts';
  let dtsContent = fs.readFileSync(dtsFile, 'utf8');
  assert(dtsContent.includes(' extends IncomingMessage'));
  assert(dtsContent.includes(' extends ServerResponse'));
  dtsContent = dtsContent
    .replace(' extends IncomingMessage', '')
    .replace(' extends ServerResponse', '');
  fs.writeFileSync(dtsFile, dtsContent);
}
