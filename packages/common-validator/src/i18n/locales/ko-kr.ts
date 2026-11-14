import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}}가 필요합니다',
    array: {
      must_be_array: '{{label}}는 배열이어야 합니다.',
      length_not_in_range: '{{label}} 배열 길이가 지정된 범위 내에 있지 않습니다.',
      not_unique: '{{label}} 배열 요소는 반복될 수 없습니다.',
    },
    boolean: {
      must_be_boolean: '{{label}}는 부울 값이어야 합니다.',
    },
    buffer: {
      must_be_buffer: '{{label}}는 버퍼여야 합니다.',
    },
    stream: {
      must_be_stream: '{{label}}는 스트림이어야 합니다.',
    },
    date: {
      must_be_date: '{{label}}는 날짜여야 합니다.',
      not_in_range: '{{label}}는 허용된 시간 범위 내에 있지 않습니다.',
    },
    number: {
      must_be_number: '{{label}}는 숫자여야 합니다.',
      must_be_integer: '{{label}}는 정수여야 합니다.',
      must_be_bigint: '{{label}}는 BigInt여야 합니다.',
      not_in_range: '{{label}}가 허용된 값 범위를 초과합니다.',
    },
    string: {
      must_be_string: '{{label}}는 문자열이어야 합니다.',
      must_be_email: '{{label}}는 이메일 형식이어야 합니다.',
      must_be_hash: '{{label}}는 해시 형식이어야 합니다.',
      must_be_ip: '{{label}}는 IP{{versions}} 주소여야 합니다.',
      must_be_ulid: '{{label}}는 ULID 형식이어야 합니다.',
      must_be_uuid: '{{label}}는 UUID{{versions}} 형식이어야 합니다.',
      length_not_in_range: '{{label}} 길이가 요구 사항을 충족하지 않습니다.',
      not_match_pattern: '{{label}}는 규칙을 준수하지 않습니다',
    },
    object: {
      must_be_object: '{{label}}는 객체여야 합니다.',
    },
    enum: {
      not_in_range: '{{label}}가 열거 범위에 없습니다.',
      only_support_string_number_boolean:
        '열거형 값은 문자열, 숫자, 부울 값만 가능합니다.',
      value_can_not_be_empty: '열거형 값은 null 값 "{{item}}"일 수 없습니다.',
      ranges_can_not_be_empty: '열거 범위는 비워둘 수 없습니다.',
      default_not_in_range: '기본값 "{{item}}"가 열거 범위에 없습니다.',
    },
    literal: {
      not_match: '{{label}}는 지정된 값이 아닙니다.',
      unsupported_value: '문자열, 숫자, 부울 및 null만 지원합니다.',
    },
    one_of: {
      not_match_rule: '{{label}}는 규칙을 준수하지 않습니다',
      match_multiple_rule: '{{label}}는 많은 규칙을 준수합니다.',
    },
    any_of: {
      not_match_rule: '{{label}}는 규칙을 준수하지 않습니다',
    },
    all_of: {
      not_match_all: '{{label}}는 모든 규칙을 충족하지 않습니다.',
    },
    url: {
      must_be_url: '{{label}}는 URL 형식이어야 합니다.',
      unsupported_scheme:
        '{{label}}에는 지원되지 않는 URL 프로토콜({{scheme}})이 포함되어 있습니다.',
    },
  },
});
