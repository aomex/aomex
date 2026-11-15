import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} er krafist',
    array: {
      must_be_array: '{{label}} verður að vera fylki',
      length_not_in_range: 'Lengd {{label}} fylkis er ekki innan tilgreinds sviðs',
      not_unique: 'Ekki er hægt að endurtaka {{label}} fylkiseiningar',
    },
    boolean: {
      must_be_boolean: '{{label}} verður að vera Boolean gildi',
    },
    buffer: {
      must_be_buffer: '{{label}} verður að vera Buffer',
    },
    stream: {
      must_be_stream: '{{label}} verður að vera Stream',
    },
    date: {
      must_be_date: '{{label}} verður að vera dagsetning',
      not_in_range: '{{label}} er ekki innan leyfilegs tímabils',
    },
    number: {
      must_be_number: '{{label}} verður að vera tala',
      must_be_integer: '{{label}} verður að vera heil tala',
      must_be_bigint: '{{label}} verður að vera BigInt',
      must_be_decimal: '{{label}} verður að vera Decimal',
      not_in_range: '{{label}} fer yfir leyfilegt gildissvið',
    },
    string: {
      must_be_string: '{{label}} verður að vera strengur',
      must_be_email: '{{label}} verður að vera á tölvupóstformi',
      must_be_hash: '{{label}} verður að vera á kjötkássasniði',
      must_be_ip: '{{label}} verður að vera IP{{versions}} heimilisfang',
      must_be_ulid: '{{label}} verður að vera á ULID sniði',
      must_be_uuid: '{{label}} verður að vera á UUID{{versions}} sniði',
      length_not_in_range: 'Lengd {{label}} uppfyllir ekki kröfur',
      not_match_pattern: '{{label}} er ekki í samræmi við reglurnar',
    },
    object: {
      must_be_object: '{{label}} verður að vera hlutur',
    },
    enum: {
      not_in_range: '{{label}} er ekki á upptalningarsviðinu',
      only_support_string_number_boolean:
        'Upptalningargildi geta aðeins verið strengir, tölur og Boolean gildi',
      value_can_not_be_empty: 'Upptalningargildið getur ekki verið núllgildi "{{item}}"',
      ranges_can_not_be_empty: 'Upptalningarsviðið má ekki vera tómt',
      default_not_in_range: 'Sjálfgefið gildi "{{item}}" er ekki á upptalningarsviðinu',
    },
    literal: {
      not_match: '{{label}} er ekki tilgreint gildi',
      unsupported_value: 'Styður aðeins strengi, tölur, boolean og núll',
    },
    one_of: {
      not_match_rule: '{{label}} er ekki í samræmi við reglurnar',
      match_multiple_rule: '{{label}} uppfyllir margar reglur',
    },
    any_of: {
      not_match_rule: '{{label}} er ekki í samræmi við reglurnar',
    },
    all_of: {
      not_match_all: '{{label}} uppfyllir ekki allar reglur',
    },
    url: {
      must_be_url: '{{label}} verður að vera á vefslóðarsniði',
      unsupported_scheme:
        '{{label}} inniheldur óstudda vefslóð samskiptareglur: {{scheme}}',
    },
  },
});
