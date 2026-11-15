import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} обязателен',
    array: {
      must_be_array: '{{label}} должен быть массивом',
      length_not_in_range: 'Длина массива {{label}} не находится в указанном диапазоне',
      not_unique: 'Элементы массива {{label}} не могут повторяться.',
    },
    boolean: {
      must_be_boolean: '{{label}} должно быть логическим значением.',
    },
    buffer: {
      must_be_buffer: '{{label}} должен быть буфером',
    },
    stream: {
      must_be_stream: '{{label}} должен быть потоком',
    },
    date: {
      must_be_date: '{{label}} должна быть датой',
      not_in_range: '{{label}} находится вне допустимого диапазона времени.',
    },
    number: {
      must_be_number: '{{label}} должно быть числом',
      must_be_integer: '{{label}} должно быть целым числом.',
      must_be_bigint: '{{label}} должен быть BigInt',
      must_be_decimal: '{{label}} должен быть Decimal',
      not_in_range: '{{label}} выходит за допустимый диапазон значений',
    },
    string: {
      must_be_string: '{{label}} должен быть строкой',
      must_be_email: '{{label}} должен быть в формате электронной почты.',
      must_be_hash: '{{label}} должен быть в формате хеша.',
      must_be_ip: '{{label}} должен быть адресом IP{{versions}}.',
      must_be_ulid: '{{label}} должен быть в формате ULID.',
      must_be_uuid: '{{label}} должен быть в формате UUID{{versions}}.',
      length_not_in_range: 'Длина {{label}} не соответствует требованиям',
      not_match_pattern: '{{label}} не соответствует правилам',
    },
    object: {
      must_be_object: '{{label}} должен быть объектом',
    },
    enum: {
      not_in_range: '{{label}} не входит в диапазон перечисления',
      only_support_string_number_boolean:
        'Значения перечисления могут быть только строками, числами и логическими значениями.',
      value_can_not_be_empty:
        'Значение перечисления не может быть нулевым значением «{{item}}».',
      ranges_can_not_be_empty: 'Диапазон перечисления не может быть пустым',
      default_not_in_range:
        'Значение по умолчанию «{{item}}» находится за пределами диапазона перечисления.',
    },
    literal: {
      not_match: '{{label}} не является указанным значением',
      unsupported_value: 'Поддерживает только строки, числа, логические значения и ноль.',
    },
    one_of: {
      not_match_rule: '{{label}} не соответствует правилам',
      match_multiple_rule: '{{label}} соответствует многим правилам.',
    },
    any_of: {
      not_match_rule: '{{label}} не соответствует правилам',
    },
    all_of: {
      not_match_all: '{{label}} не соответствует всем правилам',
    },
    url: {
      must_be_url: '{{label}} должен быть в формате URL.',
      unsupported_scheme: '{{label}} содержит неподдерживаемый протокол URL: {{scheme}}.',
    },
  },
});
