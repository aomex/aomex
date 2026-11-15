import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Изисква се {{label}}',
    array: {
      must_be_array: '{{label}} трябва да е масив',
      length_not_in_range: 'Дължината на масива {{label}} не е в посочения диапазон',
      not_unique: 'Елементите на масива {{label}} не могат да се повтарят',
    },
    boolean: {
      must_be_boolean: '{{label}} трябва да е булева стойност',
    },
    buffer: {
      must_be_buffer: '{{label}} трябва да е буфер',
    },
    stream: {
      must_be_stream: '{{label}} трябва да е поток',
    },
    date: {
      must_be_date: '{{label}} трябва да е дата',
      not_in_range: '{{label}} не е в рамките на разрешения времеви диапазон',
    },
    number: {
      must_be_number: '{{label}} трябва да е число',
      must_be_integer: '{{label}} трябва да е цяло число',
      must_be_bigint: '{{label}} трябва да е BigInt',
      must_be_decimal: '{{label}} трябва да е Decimal',
      not_in_range: '{{label}} надвишава допустимия диапазон на стойност',
    },
    string: {
      must_be_string: '{{label}} трябва да е низ',
      must_be_email: '{{label}} трябва да бъде в имейл формат',
      must_be_hash: '{{label}} трябва да е в хеш формат',
      must_be_ip: '{{label}} трябва да е IP{{versions}} адрес',
      must_be_ulid: '{{label}} трябва да бъде във формат ULID',
      must_be_uuid: '{{label}} трябва да бъде във формат UUID{{versions}}',
      length_not_in_range: 'Дължината на {{label}} не отговаря на изискванията',
      not_match_pattern: '{{label}} не отговаря на правилата',
    },
    object: {
      must_be_object: '{{label}} трябва да е обект',
    },
    enum: {
      not_in_range: '{{label}} не е в диапазона за изброяване',
      only_support_string_number_boolean:
        'Стойностите за изброяване могат да бъдат само низове, числа и булеви стойности',
      value_can_not_be_empty:
        'Изброената стойност не може да бъде нулева стойност "{{item}}"',
      ranges_can_not_be_empty: 'Диапазонът за изброяване не може да бъде празен',
      default_not_in_range:
        'Стойността по подразбиране "{{item}}" не е в диапазона за изброяване',
    },
    literal: {
      not_match: '{{label}} не е посочената стойност',
      unsupported_value: 'Поддържа само низове, числа, булеви стойности и нула',
    },
    one_of: {
      not_match_rule: '{{label}} не отговаря на правилата',
      match_multiple_rule: '{{label}} спазва много правила',
    },
    any_of: {
      not_match_rule: '{{label}} не отговаря на правилата',
    },
    all_of: {
      not_match_all: '{{label}} не отговаря на всички правила',
    },
    url: {
      must_be_url: '{{label}} трябва да бъде във формат URL',
      unsupported_scheme: '{{label}} съдържа неподдържан URL протокол: {{scheme}}',
    },
  },
});
