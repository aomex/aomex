import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Reikalingas {{label}}',
    array: {
      must_be_array: '{{label}} turi būti masyvas',
      length_not_in_range: '{{label}} masyvo ilgis nepatenka į nurodytą diapazoną',
      not_unique: '{{label}} masyvo elementai negali būti kartojami',
    },
    boolean: {
      must_be_boolean: '{{label}} turi būti Būlio reikšmė',
    },
    buffer: {
      must_be_buffer: '{{label}} turi būti buferis',
    },
    stream: {
      must_be_stream: '{{label}} turi būti srautas',
    },
    date: {
      must_be_date: '{{label}} turi būti data',
      not_in_range: '{{label}} nepatenka į leistiną laiko intervalą',
    },
    number: {
      must_be_number: '{{label}} turi būti skaičius',
      must_be_integer: '{{label}} turi būti sveikas skaičius',
      must_be_bigint: '{{label}} turi būti BigInt',
      must_be_decimal: '{{label}} turi būti Decimal',
      not_in_range: '{{label}} viršija leistiną verčių diapazoną',
    },
    string: {
      must_be_string: '{{label}} turi būti eilutė',
      must_be_email: '{{label}} turi būti el. pašto formatu',
      must_be_hash: '{{label}} turi būti maišos formatu',
      must_be_ip: '{{label}} turi būti IP{{versions}} adresas',
      must_be_ulid: '{{label}} turi būti ULID formatu',
      must_be_uuid: '{{label}} turi būti UUID{{versions}} formatu',
      length_not_in_range: '{{label}} ilgis neatitinka reikalavimų',
      not_match_pattern: '{{label}} neatitinka taisyklių',
    },
    object: {
      must_be_object: '{{label}} turi būti objektas',
    },
    enum: {
      not_in_range: '{{label}} nėra sąrašo diapazone',
      only_support_string_number_boolean:
        'Sąrašų reikšmės gali būti tik eilutės, skaičiai ir Būlio reikšmės',
      value_can_not_be_empty: 'Sąrašo reikšmė negali būti nulinė reikšmė „{{item}}“',
      ranges_can_not_be_empty: 'Sąrašo diapazonas negali būti tuščias',
      default_not_in_range: 'Numatytoji reikšmė „{{item}}“ nėra sąrašo diapazone',
    },
    literal: {
      not_match: '{{label}} nėra nurodyta vertė',
      unsupported_value: 'Palaiko tik eilutes, skaičius, loginius ir nulius',
    },
    one_of: {
      not_match_rule: '{{label}} neatitinka taisyklių',
      match_multiple_rule: '{{label}} atitinka daugybę taisyklių',
    },
    any_of: {
      not_match_rule: '{{label}} neatitinka taisyklių',
    },
    all_of: {
      not_match_all: '{{label}} neatitinka visų taisyklių',
    },
    url: {
      must_be_url: '{{label}} turi būti URL formato',
      unsupported_scheme: '{{label}} yra nepalaikomas URL protokolas: {{scheme}}',
    },
  },
});
