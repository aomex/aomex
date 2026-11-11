import { createHash } from 'node:crypto';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidatorSchema } from '../base/validator-schema';
import { toValidator, type ValidatorToken } from './to-validator';

export function toDocument(source: ValidatorToken): OpenAPI.ParameterBaseObject {
  const preferredName = source instanceof ValidatorSchema ? source['name'] : undefined;
  const validator = toValidator(source);

  const {
    required,
    nullable,
    docs: { description, deprecated, example, ...schemaProperties } = {},
    defaultValue,
  } = validator['config'];
  const bothProperties = { description, deprecated, example };
  const schema: OpenAPI.SchemaObject = {
    ...schemaProperties,
    ...bothProperties,
    default: validator['getDefaultValue'](defaultValue),
    nullable: nullable || undefined,
    ...validator['toDocument'](),
  };

  if (schema.type === 'object') {
    const cleaned: OpenAPI.SchemaObject = JSON.parse(JSON.stringify(schema));
    Object.assign(schema, {
      'x-ref': encodeURIComponent(
        preferredName ?? createHash('md5').update(JSON.stringify(cleaned)).digest('hex'),
      ),
    });
  }

  return JSON.parse(
    JSON.stringify({
      ...bothProperties,
      required: required || undefined,
      schema,
    }),
  );
}
