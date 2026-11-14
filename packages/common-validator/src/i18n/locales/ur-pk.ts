import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} درکار ہے۔',
    array: {
      must_be_array: '{{label}} ایک صف ہونی چاہیے۔',
      length_not_in_range: '{{label}} صف کی لمبائی مخصوص حد کے اندر نہیں ہے۔',
      not_unique: '{{label}} صف کے عناصر کو دہرایا نہیں جا سکتا',
    },
    boolean: {
      must_be_boolean: '{{label}} ایک بولین قدر ہونی چاہیے۔',
    },
    buffer: {
      must_be_buffer: '{{label}} بفر ہونا چاہیے۔',
    },
    stream: {
      must_be_stream: '{{label}} سلسلہ ہونا ضروری ہے۔',
    },
    date: {
      must_be_date: '{{label}} ایک تاریخ ہونی چاہیے۔',
      not_in_range: '{{label}} اجازت شدہ وقت کی حد میں نہیں ہے۔',
    },
    number: {
      must_be_number: '{{label}} ایک نمبر ہونا چاہیے۔',
      must_be_integer: '{{label}} ایک عدد صحیح ہونا چاہیے۔',
      must_be_bigint: '{{label}} ایک BigInt ہونا چاہیے۔',
      not_in_range: '{{label}} اجازت شدہ قدر کی حد سے زیادہ ہے۔',
    },
    string: {
      must_be_string: '{{label}} ایک تار ہونا چاہیے۔',
      must_be_email: '{{label}} ای میل فارمیٹ میں ہونا چاہیے۔',
      must_be_hash: '{{label}} ہیش فارمیٹ میں ہونا چاہیے۔',
      must_be_ip: '{{label}} ایک IP{{versions}} پتہ ہونا چاہیے۔',
      must_be_ulid: '{{label}} ULID فارمیٹ میں ہونا چاہیے۔',
      must_be_uuid: '{{label}} UUID{{versions}} فارمیٹ میں ہونا چاہیے۔',
      length_not_in_range: '{{label}} لمبائی ضروریات کو پورا نہیں کرتی ہے۔',
      not_match_pattern: '{{label}} قواعد کی تعمیل نہیں کرتا ہے۔',
    },
    object: {
      must_be_object: '{{label}} ایک آبجیکٹ ہونا چاہیے۔',
    },
    enum: {
      not_in_range: '{{label}} گنتی کی حد میں نہیں ہے۔',
      only_support_string_number_boolean:
        'گنتی کی قدریں صرف سٹرنگز، نمبرز اور بولین ویلیوز ہو سکتی ہیں۔',
      value_can_not_be_empty: 'گنتی کی قدر صفر قدر "{{item}}" نہیں ہو سکتی',
      ranges_can_not_be_empty: 'گنتی کی حد خالی نہیں ہو سکتی',
      default_not_in_range: 'ڈیفالٹ قدر "{{item}}" گنتی کی حد میں نہیں ہے۔',
    },
    literal: {
      not_match: '{{label}} متعین قدر نہیں ہے۔',
      unsupported_value: 'صرف سٹرنگز، نمبرز، بولین اور null کو سپورٹ کرتا ہے۔',
    },
    one_of: {
      not_match_rule: '{{label}} قواعد کی تعمیل نہیں کرتا ہے۔',
      match_multiple_rule: '{{label}} بہت سے اصولوں کی تعمیل کرتا ہے۔',
    },
    any_of: {
      not_match_rule: '{{label}} قواعد کی تعمیل نہیں کرتا ہے۔',
    },
    all_of: {
      not_match_all: '{{label}} تمام اصولوں پر پورا نہیں اترتا',
    },
    url: {
      must_be_url: '{{label}} URL فارمیٹ میں ہونا چاہیے۔',
      unsupported_scheme:
        '{{label}} ایک غیر تعاون یافتہ URL پروٹوکول پر مشتمل ہے: {{scheme}}',
    },
  },
});
