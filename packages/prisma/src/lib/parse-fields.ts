import type { DMMF } from '@prisma/generator-helper';
import { pascalCase } from './pascal-case';
import { generateComments } from './generate-comments';
import { UuidValidator } from '@aomex/common';
import { matchUUID } from './match-uuid';

export const parseFields = (
  fields: readonly DMMF.Field[],
  modelName: string,
  isInput: boolean,
) => {
  const modelFields: string[] = [];

  fields.forEach((field) => {
    let validator = '';

    if (field.kind === 'object') {
      if (!field.relationName) {
        const relatedName =
          pascalCase(field.type) + (isInput ? 'Input' : 'Output') + 'Type';
        validator = field.isList ? `${relatedName}` : `rule.object(${relatedName})`;
      }
    } else if (field.kind === 'enum') {
      validator = `rule.enum(${pascalCase(field.type)}Enum)`;
    } else if (field.kind === 'scalar') {
      switch (field.type) {
        case 'Int':
        case 'Boolean':
        case 'BigInt':
          validator = 'rule.' + field.type.toLowerCase() + '()';
          break;
        case 'Decimal':
        case 'Float':
          validator = 'rule.number()';
          break;
        case 'String':
          {
            const uuid = matchUUID(field);
            if (uuid) {
              const version = uuid === true ? UuidValidator.versions : [uuid];
              validator = `rule.uuid(${JSON.stringify(version)})`;
              break;
            }
          }
          validator = 'rule.string()';
          break;
        case 'Json':
          // 不考虑基础类型还用JSON格式的场景
          validator = 'rule.anyOf([rule.object(), rule.array()])';
          break;
        case 'Bytes':
          // Postgresql特有的
          validator = 'rule.buffer()';
          break;
        case 'DateTime':
          validator = 'rule.date()';
          break;
        default:
          validator = 'rule.any()';
      }
    } else {
      throw new Error('Unknown file type: ' + field.type);
    }

    if (!validator) return;

    if (field.isList) {
      validator = `rule.array(${validator})`;
    }

    if (isInput) {
      if (
        field.hasDefaultValue &&
        field.default === '' &&
        validator.startsWith('rule.string()')
      ) {
        validator += '.allowEmptyString()';
      }
      if (field.hasDefaultValue || !field.isRequired) {
        validator += '.optional()';
      }
    } else {
      if (!field.isRequired && !field.hasDefaultValue) {
        validator += '.nullable()';
      }
    }

    if (field.documentation) {
      validator += `.docs({ description: "${field.documentation}" })`;
    }

    modelFields.push(
      generateComments(field, validator),
      `${field.name}: customColumns.${modelName}?.${field.name}?.${isInput ? 'input' : 'output'} || ${validator},`,
    );
  });

  return modelFields;
};
