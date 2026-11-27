import { createHash } from 'node:crypto';
import type { OpenAPI } from '@aomex/internal-tools';
import { toValidator, type ValidatorToken } from './to-validator';

type ValidatorDocument = Pick<
  Extract<OpenAPI.ParameterObject, { schema: unknown }>,
  'description' | 'deprecated' | 'example' | 'required'
> & {
  schema: OpenAPI.SchemaObject;
};

export function toDocument(source: ValidatorToken): ValidatorDocument {
  const validator = toValidator(source);

  const {
    required,
    nullable,
    docs: { description, deprecated, example, ...schemaProperties } = {},
    defaultValue,
    refName,
  } = validator['config'];
  const bothProperties = { description, deprecated, example };
  let schema: OpenAPI.SchemaObject = {
    ...schemaProperties,
    ...bothProperties,
    default: validator['getDefaultValue'](defaultValue),
    ...validator['toDocument'](),
  };

  if (schema.type === 'object' && refName !== undefined) {
    const cleaned: OpenAPI.SchemaObject = JSON.parse(JSON.stringify(schema));
    Object.assign(schema, {
      'x-ref': encodeURIComponent(
        refName === true
          ? createHash('md5').update(JSON.stringify(cleaned)).digest('hex')
          : refName,
      ),
    });
  }

  if (nullable && schema.type !== 'null') {
    const hasNonNullEnum = Array.isArray(schema.enum) && !schema.enum.includes(null);
    const hasNonNullConst = schema.const !== undefined && schema.const !== null;
    if (hasNonNullEnum || hasNonNullConst) {
      schema = { anyOf: [schema, { type: 'null' }] };
    } else if (typeof schema.type === 'string') {
      schema = { ...schema, type: [schema.type, 'null'] };
    } else if (Array.isArray(schema.type)) {
      if (!schema.type.includes('null')) schema.type = [...schema.type, 'null'];
    } else {
      schema = { anyOf: [schema, { type: 'null' }] };
    }
  }

  return JSON.parse(
    JSON.stringify({
      ...bothProperties,
      required: required || undefined,
      schema,
    }),
  );
}
