import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} مورد نیاز است',
    array: {
      must_be_array: '{{label}} باید یک آرایه باشد',
      length_not_in_range: 'طول آرایه {{label}} در محدوده مشخص شده نیست',
      not_unique: 'عناصر آرایه {{label}} قابل تکرار نیستند',
    },
    boolean: {
      must_be_boolean: '{{label}} باید یک مقدار بولی باشد',
    },
    buffer: {
      must_be_buffer: '{{label}} باید بافر باشد',
    },
    stream: {
      must_be_stream: '{{label}} باید Stream باشد',
    },
    date: {
      must_be_date: '{{label}} باید تاریخ باشد',
      not_in_range: '{{label}} در محدوده زمانی مجاز نیست',
    },
    number: {
      must_be_number: '{{label}} باید یک عدد باشد',
      must_be_integer: '{{label}} باید یک عدد صحیح باشد',
      must_be_bigint: '{{label}} باید BigInt باشد',
      not_in_range: '{{label}} از محدوده مقدار مجاز فراتر می رود',
    },
    string: {
      must_be_string: '{{label}} باید یک رشته باشد',
      must_be_email: '{{label}} باید در قالب ایمیل باشد',
      must_be_hash: '{{label}} باید در قالب هش باشد',
      must_be_ip: '{{label}} باید یک آدرس IP{{versions}} باشد',
      must_be_ulid: '{{label}} باید در قالب ULID باشد',
      must_be_uuid: '{{label}} باید در قالب UUID{{versions}} باشد',
      length_not_in_range: 'طول {{label}} الزامات را برآورده نمی کند',
      not_match_pattern: '{{label}} با قوانین مطابقت ندارد',
    },
    object: {
      must_be_object: '{{label}} باید یک شی باشد',
    },
    enum: {
      not_in_range: '{{label}} در محدوده شمارش نیست',
      only_support_string_number_boolean:
        'مقادیر شمارش فقط می توانند رشته ها، اعداد و مقادیر بولی باشند',
      value_can_not_be_empty: 'مقدار شمارش نمی تواند یک مقدار تهی "{{item}}" باشد',
      ranges_can_not_be_empty: 'محدوده شمارش نمی تواند خالی باشد',
      default_not_in_range: 'مقدار پیش فرض "{{item}}" در محدوده شمارش نیست',
    },
    literal: {
      not_match: '{{label}} مقدار مشخص شده نیست',
      unsupported_value: 'فقط رشته ها، اعداد، بولی ها و تهی را پشتیبانی می کند',
    },
    one_of: {
      not_match_rule: '{{label}} با قوانین مطابقت ندارد',
      match_multiple_rule: '{{label}} با بسیاری از قوانین مطابقت دارد',
    },
    any_of: {
      not_match_rule: '{{label}} با قوانین مطابقت ندارد',
    },
    all_of: {
      not_match_all: '{{label}} تمام قوانین را رعایت نمی کند',
    },
    url: {
      must_be_url: '{{label}} باید در قالب URL باشد',
      unsupported_scheme: '{{label}} حاوی یک پروتکل URL پشتیبانی نشده است: {{scheme}}',
    },
  },
});
