import { i18n } from '../i18n';

i18n.register('en_US', 'core', {
  validator: {
    required: '{{label}}: required',
    validation_failed: 'Validate failed: ',

    array: {
      must_be_array: '{{label}}: must be array',
      length_not_in_range: '{{label}}: array length not in range',
    },
    boolean: {
      must_be_boolean: '{{label}}: must be boolean',
    },
    buffer: {
      must_be_buffer: '{{label}}: must be buffer',
    },
    stream: {
      must_be_stream: '{{label}}: must be stream',
    },
    dateTime: {
      must_be_date: '{{label}}: must be date-time',
      not_in_range: '{{label}}: time not in range',
    },
    number: {
      must_be_number: '{{label}}: must be number',
      must_be_integer: '{{label}}: must be integer',
      must_be_bigint: '{{label}}: must be bigint',
      not_in_range: '{{label}}: number not in range',
    },
    string: {
      must_be_string: '{{label}}: must be string',
      must_be_email: '{{label}}: must be email',
      must_be_hash: '{{label}}: must be hash format',
      must_be_ip: '{{label}}: must be IP{{versions}} address',
      must_be_ulid: '{{label}}: must be ULID format',
      must_be_uuid: '{{label}}: must be UUID{{versions}} format',
      length_not_in_range: '{{label}}: string length not in range',
      not_match_pattern: '{{label}}: string not matched pattern',
    },
    object: {
      must_be_object: '{{label}}: must be object',
    },
    enum: {
      not_in_range: '{{label}}: not in enum',
      only_support_string_number: 'enum values can be only string or number',
      can_not_be_empty: 'enum values can not be empty: "{{item}}"',
    },
    one_of: {
      not_match_rule: '{{label}}: does not match rules',
    },
    url: {
      must_be_url: '{{label}}: must be URL format',
      unsupported_scheme: '{{label}}: URL contains unsupported scheme: {{scheme}}',
    },
  },
  middleware: {
    call_next_multiple: 'call next() multiple times',
  },
});
