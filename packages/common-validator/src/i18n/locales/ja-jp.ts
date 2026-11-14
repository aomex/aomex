import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}}は必須です',
    array: {
      must_be_array: '{{label}} は配列でなければなりません',
      length_not_in_range: '{{label}} 配列の長さが指定された範囲内にありません',
      not_unique: '{{label}} 配列要素を繰り返すことはできません',
    },
    boolean: {
      must_be_boolean: '{{label}} はブール値でなければなりません',
    },
    buffer: {
      must_be_buffer: '{{label}} はバッファでなければなりません',
    },
    stream: {
      must_be_stream: '{{label}} はストリームである必要があります',
    },
    date: {
      must_be_date: '{{label}} は日付である必要があります',
      not_in_range: '{{label}} は許可された時間範囲内にありません',
    },
    number: {
      must_be_number: '{{label}} は数字でなければなりません',
      must_be_integer: '{{label}} は整数でなければなりません',
      must_be_bigint: '{{label}} は BigInt でなければなりません',
      not_in_range: '{{label}} が許容値の範囲を超えています',
    },
    string: {
      must_be_string: '{{label}} は文字列である必要があります',
      must_be_email: '{{label}} は電子メール形式である必要があります',
      must_be_hash: '{{label}} はハッシュ形式である必要があります',
      must_be_ip: '{{label}} は IP{{versions}} アドレスである必要があります',
      must_be_ulid: '{{label}} は ULID 形式である必要があります',
      must_be_uuid: '{{label}} は UUID{{versions}} 形式である必要があります',
      length_not_in_range: '{{label}} 長さが要件を満たしていません',
      not_match_pattern: '{{label}}はルールを遵守していません',
    },
    object: {
      must_be_object: '{{label}} はオブジェクトである必要があります',
    },
    enum: {
      not_in_range: '{{label}} は列挙範囲にありません',
      only_support_string_number_boolean:
        '列挙値には文字列、数値、ブール値のみを使用できます',
      value_can_not_be_empty: '列挙値を NULL 値「{{item}}」にすることはできません',
      ranges_can_not_be_empty: '列挙範囲を空にすることはできません',
      default_not_in_range: 'デフォルト値「{{item}}」は列挙範囲にありません',
    },
    literal: {
      not_match: '{{label}} は指定された値ではありません',
      unsupported_value: '文字列、数値、ブール値、および null のみをサポートします',
    },
    one_of: {
      not_match_rule: '{{label}}はルールを遵守していません',
      match_multiple_rule: '{{label}} は多くのルールに準拠しています',
    },
    any_of: {
      not_match_rule: '{{label}}はルールを遵守していません',
    },
    all_of: {
      not_match_all: '{{label}} はすべてのルールを満たしていません',
    },
    url: {
      must_be_url: '{{label}} は URL 形式である必要があります',
      unsupported_scheme:
        '{{label}} にはサポートされていない URL プロトコルが含まれています: {{scheme}}',
    },
  },
});
