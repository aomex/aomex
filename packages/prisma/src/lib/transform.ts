import type { DMMF } from '@prisma/generator-helper';
import { generateJS } from './generate-js';
import { generateDTS } from './generate-dts';
import { generateEnums } from './generate-enums';
import { generateTypes } from './generate-types';
import { generateModels } from './generate-models';
import { generateHeader } from './generate-header';

export const transform = ({
  datamodel,
}: DMMF.Document): [js: string, dts: string, ts: string] => {
  const contents: string[] = [];

  contents.push(...generateEnums(datamodel.enums));
  contents.push(...generateTypes(datamodel.types));
  contents.push(generateModels(datamodel.models));
  contents.unshift(generateHeader());

  const tsContent = contents.join('\n\n');
  return [generateJS(tsContent), generateDTS(tsContent), tsContent];
};
