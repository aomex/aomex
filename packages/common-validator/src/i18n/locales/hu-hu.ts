import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} szükséges',
    array: {
      must_be_array: 'A {{label}} tömbnek kell lennie',
      length_not_in_range: 'A {{label}} tömb hossza nincs a megadott tartományon belül',
      not_unique: 'A {{label}} tömbelemek nem ismételhetők meg',
    },
    boolean: {
      must_be_boolean: 'A {{label}} logikai értéknek kell lennie',
    },
    buffer: {
      must_be_buffer: 'A {{label}} puffernek kell lennie',
    },
    stream: {
      must_be_stream: 'A {{label}}-nek Streamnek kell lennie',
    },
    date: {
      must_be_date: 'A {{label}} dátumnak kell lennie',
      not_in_range: 'A {{label}} nincs a megengedett időtartamon belül',
    },
    number: {
      must_be_number: 'A {{label}} számnak kell lennie',
      must_be_integer: 'A {{label}} egész számnak kell lennie',
      must_be_bigint: 'A {{label}}-nek BigInt-nek kell lennie',
      must_be_decimal: 'A {{label}}-nek Decimal-nek kell lennie',
      not_in_range: 'A {{label}} meghaladja a megengedett értéktartományt',
    },
    string: {
      must_be_string: 'A {{label}} karakterláncnak kell lennie',
      must_be_email: 'A {{label}}-t e-mail formátumban kell megadni',
      must_be_hash: 'A {{label}}-nek hash formátumban kell lennie',
      must_be_ip: 'A {{label}} IP{{versions}}-címnek kell lennie',
      must_be_ulid: 'A {{label}}-nek ULID formátumúnak kell lennie',
      must_be_uuid: 'A {{label}} formátumnak UUID{{versions}} formátumúnak kell lennie',
      length_not_in_range: 'A {{label}} hossza nem felel meg a követelményeknek',
      not_match_pattern: 'A {{label}} nem felel meg a szabályoknak',
    },
    object: {
      must_be_object: 'A {{label}} objektumnak kell lennie',
    },
    enum: {
      not_in_range: 'A {{label}} nincs a felsorolási tartományban',
      only_support_string_number_boolean:
        'A felsorolási értékek csak karakterláncok, számok és logikai értékek lehetnek',
      value_can_not_be_empty: 'A felsorolás értéke nem lehet null érték "{{item}}"',
      ranges_can_not_be_empty: 'A felsorolási tartomány nem lehet üres',
      default_not_in_range:
        'Az alapértelmezett "{{item}}" érték nincs a felsorolási tartományban',
    },
    literal: {
      not_match: 'A {{label}} nem a megadott érték',
      unsupported_value:
        'Csak a karakterláncokat, számokat, logikai értékeket és nullát támogatja',
    },
    one_of: {
      not_match_rule: 'A {{label}} nem felel meg a szabályoknak',
      match_multiple_rule: 'A {{label}} számos szabálynak megfelel',
    },
    any_of: {
      not_match_rule: 'A {{label}} nem felel meg a szabályoknak',
    },
    all_of: {
      not_match_all: 'A {{label}} nem felel meg minden szabálynak',
    },
    url: {
      must_be_url: 'A {{label}}-t URL formátumban kell megadni',
      unsupported_scheme:
        'A {{label}} egy nem támogatott URL-protokollt tartalmaz: {{scheme}}',
    },
  },
});
