import { i18n } from '../i18n';

i18n.register('zh_CN', 'core', {
  validator: {
    required: '{{label}}：必填',
    validation_failed: '验证失败：',

    array: {
      must_be_array: '{{label}}：必须是数组类型',
      length_not_in_range: '{{label}}：数组长度不在指定范围内',
    },
    boolean: {
      must_be_boolean: '{{label}}：必须是布尔类型',
    },
    buffer: {
      must_be_buffer: '{{label}}：必须是buffer类型',
    },
    stream: {
      must_be_stream: '{{label}}：必须是stream类型',
    },
    dateTime: {
      must_be_date: '{{label}}：必须是时间类型',
      not_in_range: '{{label}}：不在指定时间内',
    },
    number: {
      must_be_number: '{{label}}：必须是数字类型',
      must_be_integer: '{{label}}：必须是整数',
      must_be_bigint: '{{label}}：必须是大整数类型',
      not_in_range: '{{label}}：不在指定的数字范围',
    },
    string: {
      must_be_string: '{{label}}：必须是字符串类型',
      must_be_email: '{{label}}：必须是电子邮件格式',
      must_be_hash: '{{label}}：必须是哈希格式',
      must_be_ip: '{{label}}：必须是IP{{versions}}地址',
      must_be_ulid: '{{label}}：必须是ULID格式',
      must_be_uuid: '{{label}}：必须是UUID{{versions}}格式',
      length_not_in_range: '{{label}}：字符串长度不合法',
      not_match_pattern: '{{label}}：字符串未匹配到规则',
    },
    object: {
      must_be_object: '{{label}}：必须是对象类型',
    },
    enum: {
      not_in_range: '{{label}}：不在枚举范围',
      only_support_string_number: '枚举值只能是数组或者字符串',
      can_not_be_empty: '枚举值不能是空值："{{item}}"',
    },
    one_of: {
      not_match_rule: '{{label}}：未匹配规则',
    },
    url: {
      must_be_url: '{{label}}：必须是URL格式',
      unsupported_scheme: '{{label}}：URL包含不支持的协议：{{scheme}}',
    },
  },
  middleware: {
    call_next_multiple: '多次执行中间件next()函数',
  },
});
