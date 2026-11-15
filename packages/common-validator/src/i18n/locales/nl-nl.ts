import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} is vereist',
    array: {
      must_be_array: '{{label}} moet een array zijn',
      length_not_in_range:
        'De arraylengte {{label}} ligt niet binnen het opgegeven bereik',
      not_unique: '{{label}}-array-elementen kunnen niet worden herhaald',
    },
    boolean: {
      must_be_boolean: '{{label}} moet een Booleaanse waarde zijn',
    },
    buffer: {
      must_be_buffer: '{{label}} moet buffer zijn',
    },
    stream: {
      must_be_stream: '{{label}} moet Stream zijn',
    },
    date: {
      must_be_date: '{{label}} moet een datum zijn',
      not_in_range: '{{label}} valt niet binnen het toegestane tijdsbereik',
    },
    number: {
      must_be_number: '{{label}} moet een getal zijn',
      must_be_integer: '{{label}} moet een geheel getal zijn',
      must_be_bigint: '{{label}} moet een BigInt zijn',
      must_be_decimal: '{{label}} moet een Decimal zijn',
      not_in_range: '{{label}} overschrijdt het toegestane waardebereik',
    },
    string: {
      must_be_string: '{{label}} moet een tekenreeks zijn',
      must_be_email: '{{label}} moet in e-mailformaat zijn',
      must_be_hash: '{{label}} moet de hash-indeling hebben',
      must_be_ip: '{{label}} moet een IP{{versions}}-adres zijn',
      must_be_ulid: '{{label}} moet de ULID-indeling hebben',
      must_be_uuid: '{{label}} moet de indeling UUID{{versions}} hebben',
      length_not_in_range: 'Lengte {{label}} voldoet niet aan de eisen',
      not_match_pattern: '{{label}} houdt zich niet aan de regels',
    },
    object: {
      must_be_object: '{{label}} moet een object zijn',
    },
    enum: {
      not_in_range: '{{label}} bevindt zich niet in het opsommingsbereik',
      only_support_string_number_boolean:
        'Opsommingswaarden kunnen alleen tekenreeksen, getallen en Booleaanse waarden zijn',
      value_can_not_be_empty: "De opsommingswaarde mag geen nulwaarde '{{item}}' zijn",
      ranges_can_not_be_empty: 'Het opsommingsbereik mag niet leeg zijn',
      default_not_in_range:
        "De standaardwaarde '{{item}}' ligt niet in het opsommingsbereik",
    },
    literal: {
      not_match: '{{label}} is niet de opgegeven waarde',
      unsupported_value: 'Ondersteunt alleen tekenreeksen, getallen, booleans en null',
    },
    one_of: {
      not_match_rule: '{{label}} houdt zich niet aan de regels',
      match_multiple_rule: '{{label}} voldoet aan veel regels',
    },
    any_of: {
      not_match_rule: '{{label}} houdt zich niet aan de regels',
    },
    all_of: {
      not_match_all: '{{label}} voldoet niet aan alle regels',
    },
    url: {
      must_be_url: '{{label}} moet de URL-indeling hebben',
      unsupported_scheme: '{{label}} bevat een niet-ondersteund URL-protocol: {{scheme}}',
    },
  },
});
