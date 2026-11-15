import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'საჭიროა {{label}}',
    array: {
      must_be_array: '{{label}} უნდა იყოს მასივი',
      length_not_in_range: '{{label}} მასივის სიგრძე არ არის მითითებულ დიაპაზონში',
      not_unique: '{{label}} მასივის ელემენტების გამეორება შეუძლებელია',
    },
    boolean: {
      must_be_boolean: '{{label}} უნდა იყოს ლოგიკური მნიშვნელობა',
    },
    buffer: {
      must_be_buffer: '{{label}} უნდა იყოს ბუფერი',
    },
    stream: {
      must_be_stream: '{{label}} უნდა იყოს ნაკადი',
    },
    date: {
      must_be_date: '{{label}} უნდა იყოს თარიღი',
      not_in_range: '{{label}} არ არის დაშვებული დროის დიაპაზონში',
    },
    number: {
      must_be_number: '{{label}} უნდა იყოს რიცხვი',
      must_be_integer: '{{label}} უნდა იყოს მთელი რიცხვი',
      must_be_bigint: '{{label}} უნდა იყოს BigInt',
      must_be_decimal: '{{label}} უნდა იყოს Decimal',
      not_in_range: '{{label}} აჭარბებს დაშვებულ მნიშვნელობათა დიაპაზონს',
    },
    string: {
      must_be_string: '{{label}} უნდა იყოს სტრიქონი',
      must_be_email: '{{label}} უნდა იყოს ელფოსტის ფორმატში',
      must_be_hash: '{{label}} უნდა იყოს ჰეშის ფორმატში',
      must_be_ip: '{{label}} უნდა იყოს IP{{versions}} მისამართი',
      must_be_ulid: '{{label}} უნდა იყოს ULID ფორმატში',
      must_be_uuid: '{{label}} უნდა იყოს UUID{{versions}} ფორმატში',
      length_not_in_range: '{{label}} სიგრძე არ აკმაყოფილებს მოთხოვნებს',
      not_match_pattern: '{{label}} არ შეესაბამება წესებს',
    },
    object: {
      must_be_object: '{{label}} უნდა იყოს ობიექტი',
    },
    enum: {
      not_in_range: '{{label}} არ არის აღრიცხვის დიაპაზონში',
      only_support_string_number_boolean:
        'აღრიცხვის მნიშვნელობები შეიძლება იყოს მხოლოდ სტრიქონები, რიცხვები და ლოგიკური მნიშვნელობები',
      value_can_not_be_empty:
        'ნუმერაციის მნიშვნელობა არ შეიძლება იყოს ნულოვანი მნიშვნელობა "{{item}}"',
      ranges_can_not_be_empty: 'ჩამოთვლის დიაპაზონი არ შეიძლება იყოს ცარიელი',
      default_not_in_range:
        'ნაგულისხმევი მნიშვნელობა "{{item}}" არ არის აღრიცხვის დიაპაზონში',
    },
    literal: {
      not_match: '{{label}} არ არის მითითებული მნიშვნელობა',
      unsupported_value: 'მხარს უჭერს მხოლოდ სტრიქონებს, რიცხვებს, ლოგიკურ და ნულს',
    },
    one_of: {
      not_match_rule: '{{label}} არ შეესაბამება წესებს',
      match_multiple_rule: '{{label}} შეესაბამება ბევრ წესს',
    },
    any_of: {
      not_match_rule: '{{label}} არ შეესაბამება წესებს',
    },
    all_of: {
      not_match_all: '{{label}} არ აკმაყოფილებს ყველა წესს',
    },
    url: {
      must_be_url: '{{label}} უნდა იყოს URL ფორმატში',
      unsupported_scheme: '{{label}} შეიცავს მხარდაუჭერელ URL პროტოკოლს: {{scheme}}',
    },
  },
});
