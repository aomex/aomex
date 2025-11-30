import type { DMMF } from '@prisma/generator-helper';
import { generateEnums } from './generate-enums';
import { generateTypes } from './generate-types';
import { generateModels } from './generate-models';
import { generateHeader } from './generate-header';
import { generateSchemaMap } from './generate-schema-map';
import { formatContent } from './format-content';

export const transform = (
  { datamodel }: DMMF.Document,
  output: string,
): Promise<string> => {
  const contents: string[] = [];

  contents.push(...generateEnums(datamodel.enums));
  contents.push(...generateTypes(datamodel.types));
  contents.push(generateModels(datamodel.models));
  contents.unshift(generateHeader(output));
  contents.push(
    generateSchemaMap([
      ...datamodel.models.map((model) => ({ model, type: 'model' as const })),
      ...datamodel.types.map((type) => ({ model: type, type: 'type' as const })),
    ]),
  );

  return formatContent(contents.join('\n\n'));
};
