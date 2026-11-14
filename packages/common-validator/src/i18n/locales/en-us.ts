import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} is required',

    array: {
      must_be_array: '{{label}} must be an array',
      length_not_in_range: '{{label}} out of array length range',
      not_unique: '{{label}} array items must be unique',
    },
    boolean: {
      must_be_boolean: '{{label}} must be a boolean',
    },
    buffer: {
      must_be_buffer: '{{label}} must be a Buffer',
    },
    stream: {
      must_be_stream: '{{label}} must be a Stream',
    },
    date: {
      must_be_date: '{{label}} must be a date',
      not_in_range: '{{label}} is outside the allowed time range',
    },
    number: {
      must_be_number: '{{label}} must be a number',
      must_be_integer: '{{label}} must be an integer',
      must_be_bigint: '{{label}} must be a BigInt',
      not_in_range: '{{label}} is outside the allowed numeric range',
    },
    string: {
      must_be_string: '{{label}} must be a string',
      must_be_email: '{{label}} must be email',
      must_be_hash: '{{label}} must be hash format',
      must_be_ip: '{{label}} must be IP{{versions}} address',
      must_be_ulid: '{{label}} must be ULID format',
      must_be_uuid: '{{label}} must be UUID{{versions}} format',
      length_not_in_range: '{{label}} length does not meet the requirement',
      not_match_pattern: '{{label}} does not conform to the rule',
    },
    object: {
      must_be_object: '{{label}} must be an object',
    },
    enum: {
      not_in_range: '{{label}} is not enum value',
      only_support_string_number_boolean:
        'Enum values can only be strings, numbers, or booleans',
      value_can_not_be_empty: 'Enum value cannot be empty: "{{item}}"',
      ranges_can_not_be_empty: 'enum ranges can not be empty',
      default_not_in_range: 'Default value "{{item}}" is not in the enum range',
    },
    literal: {
      not_match: '{{label}} is not the specified value',
      unsupported_value: 'Only strings, numbers, booleans, and null are supported',
    },
    one_of: {
      not_match_rule: '{{label}} does not conform to the rule',
      match_multiple_rule: '{{label}} matched more than one rule',
    },
    any_of: {
      not_match_rule: '{{label}} does not conform to the rule',
    },
    all_of: {
      not_match_all: '{{label}} does not satisfy all rules',
    },
    url: {
      must_be_url: '{{label}} must be URL format',
      unsupported_scheme: '{{label}} contains an unsupported URL scheme: {{scheme}}',
    },
  },
});
