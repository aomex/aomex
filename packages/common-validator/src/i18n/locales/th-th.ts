import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'ต้องมี {{label}}',
    array: {
      must_be_array: '{{label}} ต้องเป็นอาร์เรย์',
      length_not_in_range: 'ความยาวอาร์เรย์ {{label}} ไม่อยู่ในช่วงที่ระบุ',
      not_unique: 'องค์ประกอบอาร์เรย์ {{label}} ไม่สามารถทำซ้ำได้',
    },
    boolean: {
      must_be_boolean: '{{label}} ต้องเป็นค่าบูลีน',
    },
    buffer: {
      must_be_buffer: '{{label}} จะต้องเป็นบัฟเฟอร์',
    },
    stream: {
      must_be_stream: '{{label}} ต้องเป็นสตรีม',
    },
    date: {
      must_be_date: '{{label}} ต้องเป็นเดท',
      not_in_range: '{{label}} ไม่อยู่ภายในช่วงเวลาที่อนุญาต',
    },
    number: {
      must_be_number: '{{label}} ต้องเป็นตัวเลข',
      must_be_integer: '{{label}} ต้องเป็นจำนวนเต็ม',
      must_be_bigint: '{{label}} ต้องเป็น BigInt',
      must_be_decimal: '{{label}} ต้องเป็น Decimal',
      not_in_range: '{{label}} เกินช่วงค่าที่อนุญาต',
    },
    string: {
      must_be_string: '{{label}} ต้องเป็นสตริง',
      must_be_email: '{{label}} ต้องอยู่ในรูปแบบอีเมล',
      must_be_hash: '{{label}} ต้องอยู่ในรูปแบบแฮช',
      must_be_ip: '{{label}} ต้องเป็นที่อยู่ IP{{versions}}',
      must_be_ulid: '{{label}} ต้องอยู่ในรูปแบบ ULID',
      must_be_uuid: '{{label}} ต้องอยู่ในรูปแบบ UUID{{versions}}',
      length_not_in_range: 'ความยาว {{label}} ไม่เป็นไปตามข้อกำหนด',
      not_match_pattern: '{{label}} ไม่ปฏิบัติตามกฎเกณฑ์',
    },
    object: {
      must_be_object: '{{label}} ต้องเป็นวัตถุ',
    },
    enum: {
      not_in_range: '{{label}} ไม่อยู่ในช่วงแจงนับ',
      only_support_string_number_boolean:
        'ค่าการแจงนับต้องเป็นสตริง ตัวเลข และค่าบูลีนเท่านั้น',
      value_can_not_be_empty: 'ค่าแจงนับไม่สามารถเป็นค่าว่าง "{{item}}"',
      ranges_can_not_be_empty: 'ช่วงการแจงนับต้องไม่เว้นว่าง',
      default_not_in_range: 'ค่าเริ่มต้น "{{item}}" ไม่อยู่ในช่วงแจงนับ',
    },
    literal: {
      not_match: '{{label}} ไม่ใช่ค่าที่ระบุ',
      unsupported_value: 'รองรับเฉพาะสตริง ตัวเลข บูลีน และค่าว่างเท่านั้น',
    },
    one_of: {
      not_match_rule: '{{label}} ไม่ปฏิบัติตามกฎเกณฑ์',
      match_multiple_rule: '{{label}} ปฏิบัติตามกฎเกณฑ์มากมาย',
    },
    any_of: {
      not_match_rule: '{{label}} ไม่ปฏิบัติตามกฎเกณฑ์',
    },
    all_of: {
      not_match_all: '{{label}} ไม่เป็นไปตามกฎทั้งหมด',
    },
    url: {
      must_be_url: '{{label}} ต้องอยู่ในรูปแบบ URL',
      unsupported_scheme: '{{label}} มีโปรโตคอล URL ที่ไม่รองรับ: {{scheme}}',
    },
  },
});
