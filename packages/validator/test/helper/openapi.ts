import { describe, expect, test } from 'vitest';
import { Validator } from '../../src';

const expectOpenapiSnapshot = (validator: Validator) => {
  expect(Validator.toDocument(validator)).toMatchSnapshot();
};

const expectOpenapiWithDocs = (validator: Validator) => {
  expect(
    Validator.toDocument(
      validator.docs({
        deprecated: true,
        description: 'Hello Test',
      }),
    ),
  ).toMatchSnapshot();
};

export const testOpenapi = (options: {
  required: Validator;
  optional: Validator;
  withDefault: Validator;
  withDocs: Validator;
}) => {
  describe('Openapi', () => {
    test('Required', () => {
      expectOpenapiSnapshot(options.required);
    });

    test('Optional', () => {
      expectOpenapiSnapshot(options.optional);
    });

    test('With default value', () => {
      expectOpenapiSnapshot(options.withDefault);
    });

    test('With extra infos', () => {
      expectOpenapiWithDocs(options.withDocs);
    });
  });
};
