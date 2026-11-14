import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} er påkrævet',
    array: {
      must_be_array: '{{label}} skal være et array',
      length_not_in_range:
        '{{label}}-arraylængden er ikke inden for det angivne interval',
      not_unique: '{{label}} array-elementer kan ikke gentages',
    },
    boolean: {
      must_be_boolean: '{{label}} skal være en boolesk værdi',
    },
    buffer: {
      must_be_buffer: '{{label}} skal være buffer',
    },
    stream: {
      must_be_stream: '{{label}} skal være Stream',
    },
    date: {
      must_be_date: '{{label}} skal være en dato',
      not_in_range: '{{label}} er ikke inden for det tilladte tidsinterval',
    },
    number: {
      must_be_number: '{{label}} skal være et tal',
      must_be_integer: '{{label}} skal være et heltal',
      must_be_bigint: '{{label}} skal være en BigInt',
      not_in_range: '{{label}} overskrider det tilladte værdiområde',
    },
    string: {
      must_be_string: '{{label}} skal være en streng',
      must_be_email: '{{label}} skal være i e-mail-format',
      must_be_hash: '{{label}} skal være i hash-format',
      must_be_ip: '{{label}} skal være en IP{{versions}}-adresse',
      must_be_ulid: '{{label}} skal være i ULID-format',
      must_be_uuid: '{{label}} skal være i UUID{{versions}}-format',
      length_not_in_range: '{{label}} længde opfylder ikke kravene',
      not_match_pattern: '{{label}} overholder ikke reglerne',
    },
    object: {
      must_be_object: '{{label}} skal være et objekt',
    },
    enum: {
      not_in_range: '{{label}} er ikke i opregningsområdet',
      only_support_string_number_boolean:
        'Optællingsværdier kan kun være strenge, tal og booleske værdier',
      value_can_not_be_empty: 'Opregningsværdien kan ikke være en nulværdi "{{item}}"',
      ranges_can_not_be_empty: 'Optællingsområdet må ikke være tomt',
      default_not_in_range: 'Standardværdien "{{item}}" er ikke i opregningsområdet',
    },
    literal: {
      not_match: '{{label}} er ikke den angivne værdi',
      unsupported_value: 'Understøtter kun strenge, tal, booleans og null',
    },
    one_of: {
      not_match_rule: '{{label}} overholder ikke reglerne',
      match_multiple_rule: '{{label}} overholder mange regler',
    },
    any_of: {
      not_match_rule: '{{label}} overholder ikke reglerne',
    },
    all_of: {
      not_match_all: '{{label}} opfylder ikke alle reglerne',
    },
    url: {
      must_be_url: '{{label}} skal være i URL-format',
      unsupported_scheme:
        '{{label}} indeholder en ikke-understøttet URL-protokol: {{scheme}}',
    },
  },
});
