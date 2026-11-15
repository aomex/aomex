import { I18n } from '@aomex/internal-tools';

export const zh = I18n.define({
  validator: {
    required: '{{label}}为必填项',

    array: {
      must_be_array: '{{label}}必须为数组',
      length_not_in_range: '{{label}}数组长度不在指定范围内',
      not_unique: '{{label}}数组元素不能重复',
    },
    boolean: {
      must_be_boolean: '{{label}}必须为布尔值',
    },
    buffer: {
      must_be_buffer: '{{label}}必须为 Buffer',
    },
    stream: {
      must_be_stream: '{{label}}必须为 Stream',
    },
    date: {
      must_be_date: '{{label}}必须为日期',
      not_in_range: '{{label}}不在允许的时间范围内',
    },
    number: {
      must_be_number: '{{label}}必须为数字',
      must_be_integer: '{{label}}必须为整数',
      must_be_bigint: '{{label}}必须为 BigInt',
      must_be_decimal: '{{label}}必须为 Decimal',
      not_in_range: '{{label}}超出允许的数值范围',
    },
    string: {
      must_be_string: '{{label}}必须为字符串',
      must_be_email: '{{label}}必须是电子邮件格式',
      must_be_hash: '{{label}}必须是哈希格式',
      must_be_ip: '{{label}}必须是IP{{versions}}地址',
      must_be_ulid: '{{label}}必须是ULID格式',
      must_be_uuid: '{{label}}必须是UUID{{versions}}格式',
      length_not_in_range: '{{label}}长度不符合要求',
      not_match_pattern: '{{label}}不符合规则',
    },
    object: {
      must_be_object: '{{label}}必须为对象',
    },
    enum: {
      not_in_range: '{{label}}不在枚举范围',
      only_support_string_number_boolean: '枚举值只能是字符串、数字和布尔值',
      value_can_not_be_empty: '枚举值不能是空值「{{item}}」',
      ranges_can_not_be_empty: '枚举范围不能为空',
      default_not_in_range: '默认值「{{item}}」不在枚举范围',
    },
    literal: {
      not_match: '{{label}}不是指定的值',
      unsupported_value: '只支持字符串、数字、布尔值和 null',
    },
    one_of: {
      not_match_rule: '{{label}}不符合规则',
      match_multiple_rule: '{{label}}符合了多条规则',
    },
    any_of: {
      not_match_rule: '{{label}}不符合规则',
    },
    all_of: {
      not_match_all: '{{label}}不符合全部规则',
    },
    url: {
      must_be_url: '{{label}}必须是URL格式',
      unsupported_scheme: '{{label}}包含不支持的 URL 协议：{{scheme}}',
    },
  },
});
