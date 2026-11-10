import type { DMMF } from '@prisma/generator-helper';
import { generateEnums } from './generate-enums';
import { generateTypes } from './generate-types';
import { generateModels } from './generate-models';
import { generateHeader } from './generate-header';
import { formatContent } from './format-content';

export const transform = ({ datamodel }: DMMF.Document): Promise<string> => {
  const contents: string[] = [];

  contents.push(...generateEnums(datamodel.enums));
  contents.push(...generateTypes(datamodel.types));
  contents.push(generateModels(datamodel.models));
  contents.unshift(generateHeader());

  return formatContent(contents.join('\n\n'));
};
