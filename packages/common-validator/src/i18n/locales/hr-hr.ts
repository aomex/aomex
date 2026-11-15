import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} je obavezan',
    array: {
      must_be_array: '{{label}} mora biti niz',
      length_not_in_range: 'Dužina niza {{label}} nije unutar navedenog raspona',
      not_unique: 'Elementi polja {{label}} ne mogu se ponavljati',
    },
    boolean: {
      must_be_boolean: '{{label}} mora biti Booleova vrijednost',
    },
    buffer: {
      must_be_buffer: '{{label}} mora biti međuspremnik',
    },
    stream: {
      must_be_stream: '{{label}} mora biti Stream',
    },
    date: {
      must_be_date: '{{label}} mora biti spoj',
      not_in_range: '{{label}} nije unutar dopuštenog vremenskog raspona',
    },
    number: {
      must_be_number: '{{label}} mora biti broj',
      must_be_integer: '{{label}} mora biti cijeli broj',
      must_be_bigint: '{{label}} mora biti BigInt',
      must_be_decimal: '{{label}} mora biti Decimal',
      not_in_range: '{{label}} prelazi dopušteni raspon vrijednosti',
    },
    string: {
      must_be_string: '{{label}} mora biti niz',
      must_be_email: '{{label}} mora biti u formatu e-pošte',
      must_be_hash: '{{label}} mora biti u hash formatu',
      must_be_ip: '{{label}} mora biti IP{{versions}} adresa',
      must_be_ulid: '{{label}} mora biti u ULID formatu',
      must_be_uuid: '{{label}} mora biti u formatu UUID{{versions}}',
      length_not_in_range: 'Dužina {{label}} ne zadovoljava zahtjeve',
      not_match_pattern: '{{label}} nije u skladu s pravilima',
    },
    object: {
      must_be_object: '{{label}} mora biti objekt',
    },
    enum: {
      not_in_range: '{{label}} nije u rasponu nabrajanja',
      only_support_string_number_boolean:
        'Vrijednosti nabrajanja mogu biti samo nizovi, brojevi i Booleove vrijednosti',
      value_can_not_be_empty:
        'Vrijednost nabrajanja ne može biti nulta vrijednost "{{item}}"',
      ranges_can_not_be_empty: 'Raspon nabrajanja ne može biti prazan',
      default_not_in_range: 'Zadana vrijednost "{{item}}" nije u rasponu nabrajanja',
    },
    literal: {
      not_match: '{{label}} nije navedena vrijednost',
      unsupported_value: 'Podržava samo nizove, brojeve, booleove vrijednosti i null',
    },
    one_of: {
      not_match_rule: '{{label}} nije u skladu s pravilima',
      match_multiple_rule: '{{label}} je u skladu s mnogim pravilima',
    },
    any_of: {
      not_match_rule: '{{label}} nije u skladu s pravilima',
    },
    all_of: {
      not_match_all: '{{label}} ne ispunjava sva pravila',
    },
    url: {
      must_be_url: '{{label}} mora biti u URL formatu',
      unsupported_scheme: '{{label}} sadrži nepodržani URL protokol: {{scheme}}',
    },
  },
});
