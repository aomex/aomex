#!/usr/bin/env node

import cjsPrismaHelper from '@prisma/generator-helper';
import path from 'node:path';
import { save } from './lib/save';
import { transform } from './lib/transform';

cjsPrismaHelper.generatorHandler({
  onManifest() {
    return {
      prettyName: 'Prisma aomex rules generator',
      defaultOutput: path.resolve('src', 'generated', 'aomex-prisma'),
    };
  },
  async onGenerate(options) {
    const [jsContent, dtsContent] = transform(options.dmmf);
    const output = options.generator.output!.value!;
    await save(output, jsContent, dtsContent);
  },
});
