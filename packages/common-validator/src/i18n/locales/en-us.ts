import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} is required',

    array: {
      must_be_array: '{{label}} must be array',
      length_not_in_range: '{{label}} out of array length range',
    },
    boolean: {
      must_be_boolean: '{{label}} must be boolean',
    },
    buffer: {
      must_be_buffer: '{{label}} must be buffer',
    },
    stream: {
      must_be_stream: '{{label}} must be stream',
    },
    date: {
      must_be_date: '{{label}} must be datetime',
      not_in_range: '{{label}} is out of datetime range',
    },
    number: {
      must_be_number: '{{label}} must be number',
      must_be_integer: '{{label}} must be integer',
      must_be_bigint: '{{label}} must be bigint',
      not_in_range: '{{label}} is out of number range',
    },
    string: {
      must_be_string: '{{label}} must be string',
      must_be_email: '{{label}} must be email',
      must_be_hash: '{{label}} must be hash format',
      must_be_ip: '{{label}} must be IP{{versions}} address',
      must_be_ulid: '{{label}} must be ULID format',
      must_be_uuid: '{{label}} must be UUID{{versions}} format',
      length_not_in_range: '{{label}} is too long or too short',
      not_match_pattern: '{{label}} does not match given pattern',
    },
    object: {
      must_be_object: '{{label}} must be object',
    },
    enum: {
      not_in_range: '{{label}} is not enum value',
      only_support_string_number_boolean:
        'enum values can be only string, number and boolean',
      can_not_be_empty: 'enum values can not be empty: "{{item}}"',
    },
    one_of: {
      not_match_rule: '{{label}} does not match rule',
      match_multiple_rule: '{{label}} match more than one rule',
    },
    any_of: {
      not_match_rule: '{{label}} does not match rule',
    },
    all_of: {
      not_match_all: '{{label}} does not match all rules',
    },
    url: {
      must_be_url: '{{label}} must be URL format',
      unsupported_scheme: '{{label}} contains unsupported URL scheme: {{scheme}}',
    },
  },
});
