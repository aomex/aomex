import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} este necesar',
    array: {
      must_be_array: '{{label}} trebuie să fie o matrice',
      length_not_in_range: 'Lungimea matricei {{label}} nu este în intervalul specificat',
      not_unique: 'Elementele matricei {{label}} nu pot fi repetate',
    },
    boolean: {
      must_be_boolean: '{{label}} trebuie să fie o valoare booleană',
    },
    buffer: {
      must_be_buffer: '{{label}} trebuie să fie Buffer',
    },
    stream: {
      must_be_stream: '{{label}} trebuie să fie Stream',
    },
    date: {
      must_be_date: '{{label}} trebuie să fie o întâlnire',
      not_in_range: '{{label}} nu este în intervalul de timp permis',
    },
    number: {
      must_be_number: '{{label}} trebuie să fie un număr',
      must_be_integer: '{{label}} trebuie să fie un număr întreg',
      must_be_bigint: '{{label}} trebuie să fie un BigInt',
      not_in_range: '{{label}} depășește intervalul de valori permis',
    },
    string: {
      must_be_string: '{{label}} trebuie să fie un șir',
      must_be_email: '{{label}} trebuie să fie în format de e-mail',
      must_be_hash: '{{label}} trebuie să fie în format hash',
      must_be_ip: '{{label}} trebuie să fie o adresă IP{{versions}}',
      must_be_ulid: '{{label}} trebuie să fie în format ULID',
      must_be_uuid: '{{label}} trebuie să fie în format UUID{{versions}}',
      length_not_in_range: 'Lungimea {{label}} nu îndeplinește cerințele',
      not_match_pattern: '{{label}} nu respectă regulile',
    },
    object: {
      must_be_object: '{{label}} trebuie să fie un obiect',
    },
    enum: {
      not_in_range: '{{label}} nu este în intervalul de enumerare',
      only_support_string_number_boolean:
        'Valorile de enumerare pot fi numai șiruri, numere și valori booleene',
      value_can_not_be_empty:
        'Valoarea de enumerare nu poate fi o valoare nulă „{{item}}”',
      ranges_can_not_be_empty: 'Intervalul de enumerare nu poate fi gol',
      default_not_in_range:
        'Valoarea implicită „{{item}}” nu se află în intervalul de enumerare',
    },
    literal: {
      not_match: '{{label}} nu este valoarea specificată',
      unsupported_value:
        'Acceptă numai șiruri de caractere, numere, valori booleene și nul',
    },
    one_of: {
      not_match_rule: '{{label}} nu respectă regulile',
      match_multiple_rule: '{{label}} respectă multe reguli',
    },
    any_of: {
      not_match_rule: '{{label}} nu respectă regulile',
    },
    all_of: {
      not_match_all: '{{label}} nu îndeplinește toate regulile',
    },
    url: {
      must_be_url: '{{label}} trebuie să fie în format URL',
      unsupported_scheme: '{{label}} conține un protocol URL neacceptat: {{scheme}}',
    },
  },
});
