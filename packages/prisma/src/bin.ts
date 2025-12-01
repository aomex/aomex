#!/usr/bin/env node

import cjsPrismaHelper from '@prisma/generator-helper';
import path from 'node:path';
import { saveTsContent } from './lib/save-ts-content.ts';
import { transform } from './lib/transform';
import { saveHelperContent } from './lib/save-helper-content';

cjsPrismaHelper.generatorHandler({
  onManifest() {
    return {
      prettyName: 'Prisma aomex rules generator',
      defaultOutput: path.resolve('src', 'generated', 'aomex', 'prisma'),
    };
  },
  async onGenerate(options) {
    const output = options.generator.output!.value!;
    const tsContent = await transform(options.dmmf, output);
    await saveTsContent(output, tsContent);
    await saveHelperContent(output);
  },
});
