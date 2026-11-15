import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'ЗЗ0ЗЗ је обавезан',
    array: {
      must_be_array: 'ЗЗ0ЗЗ мора бити низ',
      length_not_in_range: 'Дужина низа ЗЗ0ЗЗ није унутар наведеног опсега',
      not_unique: 'Елементи низа ЗЗ0ЗЗ се не могу поновити',
    },
    boolean: {
      must_be_boolean: 'ЗЗ0ЗЗ мора бити Боолеан вредност',
    },
    buffer: {
      must_be_buffer: 'ЗЗ0ЗЗ мора бити Буффер',
    },
    stream: {
      must_be_stream: 'ЗЗ0ЗЗ мора бити Стреам',
    },
    date: {
      must_be_date: 'ЗЗ0ЗЗ мора бити датум',
      not_in_range: 'ЗЗ0ЗЗ није у дозвољеном временском опсегу',
    },
    number: {
      must_be_number: 'ЗЗ0ЗЗ мора бити број',
      must_be_integer: 'ЗЗ0ЗЗ мора бити цео број',
      must_be_bigint: 'ЗЗ0ЗЗ мора бити БигИнт',
      must_be_decimal: '{{label}} must be a Decimal',
      not_in_range: 'ЗЗ0ЗЗ прелази дозвољени опсег вредности',
    },
    string: {
      must_be_string: 'ЗЗ0ЗЗ мора бити стринг',
      must_be_email: 'ЗЗ0ЗЗ мора бити у формату е-поште',
      must_be_hash: 'ЗЗ0ЗЗ мора бити у хеш формату',
      must_be_ip: 'ЗЗ0ЗЗ мора бити ИПЗЗ1ЗЗ адреса',
      must_be_ulid: 'ЗЗ0ЗЗ мора бити у УЛИД формату',
      must_be_uuid: 'ЗЗ0ЗЗ мора бити у УУИДЗЗ1ЗЗ формату',
      length_not_in_range: 'Дужина ЗЗ0ЗЗ не испуњава услове',
      not_match_pattern: 'ЗЗ0ЗЗ се не придржава правила',
    },
    object: {
      must_be_object: 'ЗЗ0ЗЗ мора бити објекат',
    },
    enum: {
      not_in_range: 'ЗЗ0ЗЗ није у опсегу набрајања',
      only_support_string_number_boolean:
        'Вредности набрајања могу бити само стрингови, бројеви и логичке вредности',
      value_can_not_be_empty: 'Вредност набрајања не може бити нулта вредност „ЗЗ0ЗЗ“',
      ranges_can_not_be_empty: 'Опсег набрајања не може бити празан',
      default_not_in_range: 'Подразумевана вредност „ЗЗ0ЗЗ“ није у опсегу набрајања',
    },
    literal: {
      not_match: 'ЗЗ0ЗЗ није наведена вредност',
      unsupported_value: 'Подржава само низове, бројеве, логичке вредности и нулл',
    },
    one_of: {
      not_match_rule: 'ЗЗ0ЗЗ се не придржава правила',
      match_multiple_rule: 'ЗЗ0ЗЗ је у складу са многим правилима',
    },
    any_of: {
      not_match_rule: 'ЗЗ0ЗЗ се не придржава правила',
    },
    all_of: {
      not_match_all: 'ЗЗ0ЗЗ не испуњава сва правила',
    },
    url: {
      must_be_url: 'ЗЗ0ЗЗ мора бити у УРЛ формату',
      unsupported_scheme: 'ЗЗ0ЗЗ садржи неподржани УРЛ протокол: ЗЗ1ЗЗ',
    },
  },
});
