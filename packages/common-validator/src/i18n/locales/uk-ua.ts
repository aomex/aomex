import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Потрібен {{label}}',
    array: {
      must_be_array: '{{label}} має бути масивом',
      length_not_in_range: 'Довжина масиву {{label}} не входить у вказаний діапазон',
      not_unique: 'Елементи масиву {{label}} не можна повторювати',
    },
    boolean: {
      must_be_boolean: '{{label}} має бути логічним значенням',
    },
    buffer: {
      must_be_buffer: '{{label}} має бути буфером',
    },
    stream: {
      must_be_stream: '{{label}} має бути потоком',
    },
    date: {
      must_be_date: '{{label}} має бути датою',
      not_in_range: '{{label}} не входить у дозволений діапазон часу',
    },
    number: {
      must_be_number: '{{label}} має бути числом',
      must_be_integer: '{{label}} має бути цілим числом',
      must_be_bigint: '{{label}} має бути BigInt',
      must_be_decimal: '{{label}} має бути Decimal',
      not_in_range: '{{label}} перевищує допустимий діапазон значень',
    },
    string: {
      must_be_string: '{{label}} має бути рядком',
      must_be_email: '{{label}} має бути у форматі електронної пошти',
      must_be_hash: '{{label}} має бути у хеш-форматі',
      must_be_ip: '{{label}} має бути адресою IP{{versions}}',
      must_be_ulid: '{{label}} має бути у форматі ULID',
      must_be_uuid: '{{label}} має бути у форматі UUID{{versions}}',
      length_not_in_range: 'Довжина {{label}} не відповідає вимогам',
      not_match_pattern: '{{label}} не відповідає правилам',
    },
    object: {
      must_be_object: '{{label}} має бути об’єктом',
    },
    enum: {
      not_in_range: '{{label}} не входить до діапазону перерахування',
      only_support_string_number_boolean:
        'Значення перерахування можуть бути лише рядками, числами та логічними значеннями',
      value_can_not_be_empty:
        'Значення перерахування не може бути нульовим значенням "{{item}}"',
      ranges_can_not_be_empty: 'Діапазон перерахування не може бути порожнім',
      default_not_in_range:
        'Значення за замовчуванням "{{item}}" не входить до діапазону перерахування',
    },
    literal: {
      not_match: '{{label}} не є вказаним значенням',
      unsupported_value: 'Підтримує лише рядки, числа, логічні значення та значення null',
    },
    one_of: {
      not_match_rule: '{{label}} не відповідає правилам',
      match_multiple_rule: '{{label}} відповідає багатьом правилам',
    },
    any_of: {
      not_match_rule: '{{label}} не відповідає правилам',
    },
    all_of: {
      not_match_all: '{{label}} не відповідає всім правилам',
    },
    url: {
      must_be_url: '{{label}} має бути у форматі URL',
      unsupported_scheme: '{{label}} містить непідтримуваний протокол URL: {{scheme}}',
    },
  },
});
