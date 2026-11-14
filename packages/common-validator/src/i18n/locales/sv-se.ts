import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} krävs',
    array: {
      must_be_array: '{{label}} måste vara en array',
      length_not_in_range:
        '{{label}}-arraylängden ligger inte inom det angivna intervallet',
      not_unique: '{{label}}-matriselement kan inte upprepas',
    },
    boolean: {
      must_be_boolean: '{{label}} måste vara ett booleskt värde',
    },
    buffer: {
      must_be_buffer: '{{label}} måste vara buffert',
    },
    stream: {
      must_be_stream: '{{label}} måste vara Stream',
    },
    date: {
      must_be_date: '{{label}} måste vara ett datum',
      not_in_range: '{{label}} ligger inte inom det tillåtna tidsintervallet',
    },
    number: {
      must_be_number: '{{label}} måste vara ett nummer',
      must_be_integer: '{{label}} måste vara ett heltal',
      must_be_bigint: '{{label}} måste vara en BigInt',
      not_in_range: '{{label}} överskrider det tillåtna värdeområdet',
    },
    string: {
      must_be_string: '{{label}} måste vara en sträng',
      must_be_email: '{{label}} måste vara i e-postformat',
      must_be_hash: '{{label}} måste vara i hash-format',
      must_be_ip: '{{label}} måste vara en IP{{versions}}-adress',
      must_be_ulid: '{{label}} måste vara i ULID-format',
      must_be_uuid: '{{label}} måste vara i UUID{{versions}}-format',
      length_not_in_range: '{{label}} längd uppfyller inte kraven',
      not_match_pattern: '{{label}} följer inte reglerna',
    },
    object: {
      must_be_object: '{{label}} måste vara ett objekt',
    },
    enum: {
      not_in_range: '{{label}} är inte i uppräkningsintervallet',
      only_support_string_number_boolean:
        'Uppräkningsvärden kan bara vara strängar, siffror och booleska värden',
      value_can_not_be_empty: 'Uppräkningsvärdet kan inte vara ett nollvärde "{{item}}"',
      ranges_can_not_be_empty: 'Uppräkningsintervallet får inte vara tomt',
      default_not_in_range:
        'Standardvärdet "{{item}}" ligger inte inom uppräkningsområdet',
    },
    literal: {
      not_match: '{{label}} är inte det angivna värdet',
      unsupported_value: 'Stöder endast strängar, siffror, booleaner och null',
    },
    one_of: {
      not_match_rule: '{{label}} följer inte reglerna',
      match_multiple_rule: '{{label}} följer många regler',
    },
    any_of: {
      not_match_rule: '{{label}} följer inte reglerna',
    },
    all_of: {
      not_match_all: '{{label}} uppfyller inte alla regler',
    },
    url: {
      must_be_url: '{{label}} måste vara i URL-format',
      unsupported_scheme:
        '{{label}} innehåller ett URL-protokoll som inte stöds: {{scheme}}',
    },
  },
});
