#!/usr/bin/env node

import cjsPrismaHelper from '@prisma/generator-helper';
import path from 'node:path';
import { saveTsContent } from './lib/save-ts-content';
import { transform } from './lib/transform';

cjsPrismaHelper.generatorHandler({
  onManifest() {
    return {
      prettyName: 'Prisma aomex rules generator',
      defaultOutput: path.resolve('src', 'generated', 'aomex', 'prisma'),
    };
  },
  async onGenerate(options) {
    const output = options.generator.output!.value!;
    const tsContent = await transform(options.dmmf);
    await saveTsContent(output, tsContent);
  },
});
