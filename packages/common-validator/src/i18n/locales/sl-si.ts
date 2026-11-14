import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Zahtevan je {{label}}',
    array: {
      must_be_array: '{{label}} mora biti niz',
      length_not_in_range: 'Dolžina niza {{label}} ni znotraj navedenega obsega',
      not_unique: 'Elementov niza {{label}} ni mogoče ponoviti',
    },
    boolean: {
      must_be_boolean: '{{label}} mora biti logična vrednost',
    },
    buffer: {
      must_be_buffer: '{{label}} mora biti medpomnilnik',
    },
    stream: {
      must_be_stream: '{{label}} mora biti Stream',
    },
    date: {
      must_be_date: '{{label}} mora biti datum',
      not_in_range: '{{label}} ni znotraj dovoljenega časovnega razpona',
    },
    number: {
      must_be_number: '{{label}} mora biti številka',
      must_be_integer: '{{label}} mora biti celo število',
      must_be_bigint: '{{label}} mora biti BigInt',
      not_in_range: '{{label}} presega dovoljeno območje vrednosti',
    },
    string: {
      must_be_string: '{{label}} mora biti niz',
      must_be_email: '{{label}} mora biti v elektronski obliki',
      must_be_hash: '{{label}} mora biti v zgoščeni obliki',
      must_be_ip: '{{label}} mora biti naslov IP{{versions}}',
      must_be_ulid: '{{label}} mora biti v formatu ULID',
      must_be_uuid: '{{label}} mora biti v obliki UUID{{versions}}',
      length_not_in_range: 'Dolžina {{label}} ne ustreza zahtevam',
      not_match_pattern: '{{label}} ni v skladu s pravili',
    },
    object: {
      must_be_object: '{{label}} mora biti predmet',
    },
    enum: {
      not_in_range: '{{label}} ni v območju oštevilčenja',
      only_support_string_number_boolean:
        'Vrednosti oštevilčenja so lahko le nizi, števila in logične vrednosti',
      value_can_not_be_empty:
        'Vrednost oštevilčenja ne sme biti ničelna vrednost "{{item}}"',
      ranges_can_not_be_empty: 'Obseg oštevilčenja ne sme biti prazen',
      default_not_in_range: 'Privzeta vrednost "{{item}}" ni v območju oštevilčenja',
    },
    literal: {
      not_match: '{{label}} ni navedena vrednost',
      unsupported_value: 'Podpira samo nize, števila, logične vrednosti in nič',
    },
    one_of: {
      not_match_rule: '{{label}} ni v skladu s pravili',
      match_multiple_rule: '{{label}} upošteva številna pravila',
    },
    any_of: {
      not_match_rule: '{{label}} ni v skladu s pravili',
    },
    all_of: {
      not_match_all: '{{label}} ne ustreza vsem pravilom',
    },
    url: {
      must_be_url: '{{label}} mora biti v obliki URL',
      unsupported_scheme: '{{label}} vsebuje nepodprt protokol URL: {{scheme}}',
    },
  },
});
