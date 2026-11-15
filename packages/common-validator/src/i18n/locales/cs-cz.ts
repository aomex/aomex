import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Vyžaduje se {{label}}',
    array: {
      must_be_array: '{{label}} musí být pole',
      length_not_in_range: 'Délka pole {{label}} není v určeném rozsahu',
      not_unique: 'Prvky pole {{label}} nelze opakovat',
    },
    boolean: {
      must_be_boolean: '{{label}} musí být booleovská hodnota',
    },
    buffer: {
      must_be_buffer: '{{label}} musí být Buffer',
    },
    stream: {
      must_be_stream: '{{label}} musí být Stream',
    },
    date: {
      must_be_date: '{{label}} musí být datum',
      not_in_range: '{{label}} není v povoleném časovém rozsahu',
    },
    number: {
      must_be_number: '{{label}} musí být číslo',
      must_be_integer: '{{label}} musí být celé číslo',
      must_be_bigint: '{{label}} musí být BigInt',
      must_be_decimal: '{{label}} musí být Decimal',
      not_in_range: '{{label}} překračuje povolený rozsah hodnot',
    },
    string: {
      must_be_string: '{{label}} musí být řetězec',
      must_be_email: '{{label}} musí být ve formátu e-mailu',
      must_be_hash: '{{label}} musí být ve formátu hash',
      must_be_ip: '{{label}} musí být adresa IP{{versions}}',
      must_be_ulid: '{{label}} musí být ve formátu ULID',
      must_be_uuid: '{{label}} musí být ve formátu UUID{{versions}}',
      length_not_in_range: 'Délka {{label}} nesplňuje požadavky',
      not_match_pattern: '{{label}} neodpovídá pravidlům',
    },
    object: {
      must_be_object: '{{label}} musí být objekt',
    },
    enum: {
      not_in_range: '{{label}} není v rozsahu výčtu',
      only_support_string_number_boolean:
        'Hodnoty výčtu mohou být pouze řetězce, čísla a booleovské hodnoty',
      value_can_not_be_empty: 'Hodnota výčtu nemůže být nulová hodnota "{{item}}"',
      ranges_can_not_be_empty: 'Rozsah výčtu nemůže být prázdný',
      default_not_in_range: 'Výchozí hodnota "{{item}}" není v rozsahu výčtu',
    },
    literal: {
      not_match: '{{label}} není specifikovaná hodnota',
      unsupported_value: 'Podporuje pouze řetězce, čísla, booleany a null',
    },
    one_of: {
      not_match_rule: '{{label}} neodpovídá pravidlům',
      match_multiple_rule: '{{label}} vyhovuje mnoha pravidlům',
    },
    any_of: {
      not_match_rule: '{{label}} neodpovídá pravidlům',
    },
    all_of: {
      not_match_all: '{{label}} nesplňuje všechna pravidla',
    },
    url: {
      must_be_url: '{{label}} musí být ve formátu URL',
      unsupported_scheme: '{{label}} obsahuje nepodporovaný protokol URL: {{scheme}}',
    },
  },
});
