import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Wymagane jest {{label}}',
    array: {
      must_be_array: '{{label}} musi być tablicą',
      length_not_in_range: 'Długość tablicy {{label}} nie mieści się w podanym zakresie',
      not_unique: 'Elementy tablicy {{label}} nie mogą się powtarzać',
    },
    boolean: {
      must_be_boolean: '{{label}} musi być wartością logiczną',
    },
    buffer: {
      must_be_buffer: '{{label}} musi być buforem',
    },
    stream: {
      must_be_stream: '{{label}} musi być strumieniem',
    },
    date: {
      must_be_date: '{{label}} musi być datą',
      not_in_range: '{{label}} nie mieści się w dozwolonym zakresie czasu',
    },
    number: {
      must_be_number: '{{label}} musi być liczbą',
      must_be_integer: '{{label}} musi być liczbą całkowitą',
      must_be_bigint: '{{label}} musi być BigInt',
      must_be_decimal: '{{label}} musi być Decimal',
      not_in_range: '{{label}} przekracza dopuszczalny zakres wartości',
    },
    string: {
      must_be_string: '{{label}} musi być ciągiem znaków',
      must_be_email: '{{label}} musi być w formacie e-mail',
      must_be_hash: '{{label}} musi być w formacie skrótu',
      must_be_ip: '{{label}} musi być adresem IP{{versions}}',
      must_be_ulid: '{{label}} musi być w formacie ULID',
      must_be_uuid: '{{label}} musi mieć format UUID{{versions}}',
      length_not_in_range: 'Długość {{label}} nie spełnia wymagań',
      not_match_pattern: '{{label}} nie przestrzega zasad',
    },
    object: {
      must_be_object: '{{label}} musi być obiektem',
    },
    enum: {
      not_in_range: '{{label}} nie mieści się w zakresie wyliczeniowym',
      only_support_string_number_boolean:
        'Wartościami wyliczeniowymi mogą być tylko ciągi, liczby i wartości logiczne',
      value_can_not_be_empty: 'Wartość wyliczenia nie może mieć wartości null „{{item}}”',
      ranges_can_not_be_empty: 'Zakres wyliczeniowy nie może być pusty',
      default_not_in_range:
        'Wartość domyślna „{{item}}” nie mieści się w zakresie wyliczeniowym',
    },
    literal: {
      not_match: '{{label}} nie jest określoną wartością',
      unsupported_value:
        'Obsługuje tylko ciągi, liczby, wartości logiczne i wartość null',
    },
    one_of: {
      not_match_rule: '{{label}} nie przestrzega zasad',
      match_multiple_rule: '{{label}} spełnia wiele zasad',
    },
    any_of: {
      not_match_rule: '{{label}} nie przestrzega zasad',
    },
    all_of: {
      not_match_all: '{{label}} nie spełnia wszystkich zasad',
    },
    url: {
      must_be_url: '{{label}} musi być w formacie URL',
      unsupported_scheme: '{{label}} zawiera nieobsługiwany protokół URL: {{scheme}}',
    },
  },
});
