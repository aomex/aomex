import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} on nõutav',
    array: {
      must_be_array: '{{label}} peab olema massiiv',
      length_not_in_range: '{{label}} massiivi pikkus ei ole määratud vahemikus',
      not_unique: '{{label}} massiivi elemente ei saa korrata',
    },
    boolean: {
      must_be_boolean: "{{label}} peab olema Boole'i väärtus",
    },
    buffer: {
      must_be_buffer: '{{label}} peab olema puhver',
    },
    stream: {
      must_be_stream: '{{label}} peab olema voog',
    },
    date: {
      must_be_date: '{{label}} peab olema kuupäev',
      not_in_range: '{{label}} ei ole lubatud ajavahemikus',
    },
    number: {
      must_be_number: '{{label}} peab olema arv',
      must_be_integer: '{{label}} peab olema täisarv',
      must_be_bigint: '{{label}} peab olema BigInt',
      must_be_decimal: '{{label}} peab olema Decimal',
      not_in_range: '{{label}} ületab lubatud väärtusvahemikku',
    },
    string: {
      must_be_string: '{{label}} peab olema string',
      must_be_email: '{{label}} peab olema meilivormingus',
      must_be_hash: '{{label}} peab olema räsivormingus',
      must_be_ip: '{{label}} peab olema IP{{versions}} aadress',
      must_be_ulid: '{{label}} peab olema ULID-vormingus',
      must_be_uuid: '{{label}} peab olema vormingus UUID{{versions}}',
      length_not_in_range: '{{label}} pikkus ei vasta nõuetele',
      not_match_pattern: '{{label}} ei vasta reeglitele',
    },
    object: {
      must_be_object: '{{label}} peab olema objekt',
    },
    enum: {
      not_in_range: '{{label}} ei ole loendusvahemikus',
      only_support_string_number_boolean:
        "Loendiväärtused võivad olla ainult stringid, numbrid ja Boole'i väärtused",
      value_can_not_be_empty: 'Loendi väärtus ei saa olla nullväärtus "{{item}}"',
      ranges_can_not_be_empty: 'Loendamisvahemik ei saa olla tühi',
      default_not_in_range: 'Vaikeväärtus "{{item}}" ei ole loendusvahemikus',
    },
    literal: {
      not_match: '{{label}} ei ole määratud väärtus',
      unsupported_value: 'Toetab ainult stringe, numbreid, tõeväärtusi ja nullväärtusi',
    },
    one_of: {
      not_match_rule: '{{label}} ei vasta reeglitele',
      match_multiple_rule: '{{label}} vastab paljudele reeglitele',
    },
    any_of: {
      not_match_rule: '{{label}} ei vasta reeglitele',
    },
    all_of: {
      not_match_all: '{{label}} ei vasta kõigile reeglitele',
    },
    url: {
      must_be_url: '{{label}} peab olema URL-vormingus',
      unsupported_scheme: '{{label}} sisaldab toetamata URL-i protokolli: {{scheme}}',
    },
  },
});
