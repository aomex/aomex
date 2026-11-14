import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Потребен е {{label}}',
    array: {
      must_be_array: '{{label}} мора да биде низа',
      length_not_in_range: 'Должината на низата {{label}} не е во наведениот опсег',
      not_unique: 'Елементите на низата {{label}} не може да се повторат',
    },
    boolean: {
      must_be_boolean: '{{label}} мора да биде Булова вредност',
    },
    buffer: {
      must_be_buffer: '{{label}} мора да биде Buffer',
    },
    stream: {
      must_be_stream: '{{label}} мора да биде Stream',
    },
    date: {
      must_be_date: '{{label}} мора да биде датум',
      not_in_range: '{{label}} не е во дозволениот временски опсег',
    },
    number: {
      must_be_number: '{{label}} мора да биде број',
      must_be_integer: '{{label}} мора да биде цел број',
      must_be_bigint: '{{label}} мора да биде BigInt',
      not_in_range: '{{label}} го надминува дозволениот опсег на вредности',
    },
    string: {
      must_be_string: '{{label}} мора да биде стринг',
      must_be_email: '{{label}} мора да биде во формат на е-пошта',
      must_be_hash: '{{label}} мора да биде во хаш-формат',
      must_be_ip: '{{label}} мора да биде IP{{versions}} адреса',
      must_be_ulid: '{{label}} мора да биде во ULID формат',
      must_be_uuid: '{{label}} мора да биде во формат UUID{{versions}}',
      length_not_in_range: 'Должината на {{label}} не ги задоволува барањата',
      not_match_pattern: '{{label}} не ги почитува правилата',
    },
    object: {
      must_be_object: '{{label}} мора да биде објект',
    },
    enum: {
      not_in_range: '{{label}} не е во опсегот на набројување',
      only_support_string_number_boolean:
        'Вредностите за набројување можат да бидат само низи, броеви и Булови вредности',
      value_can_not_be_empty:
        'Вредноста на набројувањето не може да биде нула вредност „{{item}}“',
      ranges_can_not_be_empty: 'Опсегот на набројување не може да биде празен',
      default_not_in_range:
        'Стандардната вредност „{{item}}“ не е во опсегот на набројување',
    },
    literal: {
      not_match: '{{label}} не е одредената вредност',
      unsupported_value: 'Поддржува само низи, броеви, булови и нула',
    },
    one_of: {
      not_match_rule: '{{label}} не ги почитува правилата',
      match_multiple_rule: '{{label}} е во согласност со многу правила',
    },
    any_of: {
      not_match_rule: '{{label}} не ги почитува правилата',
    },
    all_of: {
      not_match_all: '{{label}} не ги исполнува сите правила',
    },
    url: {
      must_be_url: '{{label}} мора да биде во формат на URL',
      unsupported_scheme: '{{label}} содржи неподдржан протокол за URL: {{scheme}}',
    },
  },
});
