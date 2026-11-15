import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}}為必填項',

    array: {
      must_be_array: '{{label}}必須為陣列',
      length_not_in_range: '{{label}}陣列長度不在指定範圍內',
      not_unique: '{{label}}陣列元素不能重複',
    },
    boolean: {
      must_be_boolean: '{{label}}必須為布爾值',
    },
    buffer: {
      must_be_buffer: '{{label}}必須為 Buffer',
    },
    stream: {
      must_be_stream: '{{label}}必須為 Stream',
    },
    date: {
      must_be_date: '{{label}}必須為日期',
      not_in_range: '{{label}}不在允許的時間範圍內',
    },
    number: {
      must_be_number: '{{label}}必須為數字',
      must_be_integer: '{{label}}必須為整數',
      must_be_bigint: '{{label}}必須為 BigInt',
      must_be_decimal: '{{label}}必須為 Decimal',
      not_in_range: '{{label}}超出允許的數值範圍',
    },
    string: {
      must_be_string: '{{label}}必須為字符串',
      must_be_email: '{{label}}必須是電郵格式',
      must_be_hash: '{{label}}必須是雜湊格式',
      must_be_ip: '{{label}}必須是 IP{{versions}} 地址',
      must_be_ulid: '{{label}}必須是 ULID 格式',
      must_be_uuid: '{{label}}必須是 UUID{{versions}} 格式',
      length_not_in_range: '{{label}}長度不符合要求',
      not_match_pattern: '{{label}}不符合規則',
    },
    object: {
      must_be_object: '{{label}}必須為物件',
    },
    enum: {
      not_in_range: '{{label}}不在枚舉範圍',
      only_support_string_number_boolean: '枚舉值只能是字符串、數字和布爾值',
      value_can_not_be_empty: '枚舉值不能是空值「{{item}}」',
      ranges_can_not_be_empty: '枚舉範圍不能為空',
      default_not_in_range: '預設值「{{item}}」不在枚舉範圍',
    },
    literal: {
      not_match: '{{label}}不是指定的值',
      unsupported_value: '只支援字符串、數字、布爾值和 null',
    },
    one_of: {
      not_match_rule: '{{label}}不符合規則',
      match_multiple_rule: '{{label}}符合了多條規則',
    },
    any_of: {
      not_match_rule: '{{label}}不符合規則',
    },
    all_of: {
      not_match_all: '{{label}}不符合全部規則',
    },
    url: {
      must_be_url: '{{label}}必須是 URL 格式',
      unsupported_scheme: '{{label}}包含不支援的 URL 協議：{{scheme}}',
    },
  },
});
