import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Патрабуецца {{label}}',
    array: {
      must_be_array: '{{label}} павінен быць масівам',
      length_not_in_range: 'Даўжыня масіва {{label}} не ўваходзіць у вызначаны дыяпазон',
      not_unique: 'Элементы масіва {{label}} нельга паўтараць',
    },
    boolean: {
      must_be_boolean: '{{label}} павінна быць лагічным значэннем',
    },
    buffer: {
      must_be_buffer: '{{label}} павінен быць буферам',
    },
    stream: {
      must_be_stream: '{{label}} павінен быць Stream',
    },
    date: {
      must_be_date: '{{label}} павінна быць спатканнем',
      not_in_range: '{{label}} знаходзіцца па-за дазволеным дыяпазонам часу',
    },
    number: {
      must_be_number: '{{label}} павінен быць лікам',
      must_be_integer: '{{label}} павінна быць цэлым лікам',
      must_be_bigint: '{{label}} павінен быць BigInt',
      not_in_range: '{{label}} перавышае дазволены дыяпазон значэнняў',
    },
    string: {
      must_be_string: '{{label}} павінен быць радком',
      must_be_email: '{{label}} павінен быць у фармаце электроннай пошты',
      must_be_hash: '{{label}} павінен быць у хэш-фармаце',
      must_be_ip: '{{label}} павінен быць адрасам IP{{versions}}',
      must_be_ulid: '{{label}} павінен быць у фармаце ULID',
      must_be_uuid: '{{label}} павінен быць у фармаце UUID{{versions}}',
      length_not_in_range: 'Даўжыня {{label}} не адпавядае патрабаванням',
      not_match_pattern: '{{label}} не адпавядае правілам',
    },
    object: {
      must_be_object: "{{label}} павінен быць аб'ектам",
    },
    enum: {
      not_in_range: '{{label}} не ўваходзіць у дыяпазон пераліку',
      only_support_string_number_boolean:
        'Значэнні пералічэння могуць быць толькі радкамі, лічбамі і лагічнымі значэннямі',
      value_can_not_be_empty:
        'Значэнне пераліку не можа быць нулявым значэннем "{{item}}"',
      ranges_can_not_be_empty: 'Дыяпазон пераліку не можа быць пустым',
      default_not_in_range:
        'Значэнне па змаўчанні "{{item}}" не знаходзіцца ў дыяпазоне пераліку',
    },
    literal: {
      not_match: "{{label}} не з'яўляецца ўказаным значэннем",
      unsupported_value: 'Падтрымлівае толькі радкі, лічбы, лагічныя значэнні і нуль',
    },
    one_of: {
      not_match_rule: '{{label}} не адпавядае правілам',
      match_multiple_rule: '{{label}} адпавядае шматлікім правілам',
    },
    any_of: {
      not_match_rule: '{{label}} не адпавядае правілам',
    },
    all_of: {
      not_match_all: '{{label}} не адпавядае ўсім правілам',
    },
    url: {
      must_be_url: '{{label}} павінен быць у фармаце URL',
      unsupported_scheme: '{{label}} змяшчае непадтрымоўваны пратакол URL: {{scheme}}',
    },
  },
});
