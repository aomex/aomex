import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  validator: {
    required: '{{label}} là bắt buộc',
    array: {
      must_be_array: '{{label}} phải là một mảng',
      length_not_in_range: 'Độ dài mảng {{label}} không nằm trong phạm vi được chỉ định',
      not_unique: 'Các phần tử mảng {{label}} không thể lặp lại',
    },
    boolean: {
      must_be_boolean: '{{label}} phải là giá trị Boolean',
    },
    buffer: {
      must_be_buffer: '{{label}} phải là Bộ đệm',
    },
    stream: {
      must_be_stream: '{{label}} phải là luồng',
    },
    date: {
      must_be_date: '{{label}} phải là một cuộc hẹn hò',
      not_in_range: '{{label}} không nằm trong khoảng thời gian cho phép',
    },
    number: {
      must_be_number: '{{label}} phải là một số',
      must_be_integer: '{{label}} phải là số nguyên',
      must_be_bigint: '{{label}} phải là BigInt',
      not_in_range: '{{label}} vượt quá phạm vi giá trị cho phép',
    },
    string: {
      must_be_string: '{{label}} phải là một chuỗi',
      must_be_email: '{{label}} phải ở định dạng email',
      must_be_hash: '{{label}} phải ở định dạng băm',
      must_be_ip: '{{label}} phải là địa chỉ IP{{versions}}',
      must_be_ulid: '{{label}} phải ở định dạng ULID',
      must_be_uuid: '{{label}} phải ở định dạng UUID{{versions}}',
      length_not_in_range: 'Chiều dài {{label}} không đáp ứng yêu cầu',
      not_match_pattern: '{{label}} không tuân thủ các quy tắc',
    },
    object: {
      must_be_object: '{{label}} phải là một đối tượng',
    },
    enum: {
      not_in_range: '{{label}} không nằm trong phạm vi liệt kê',
      only_support_string_number_boolean:
        'Giá trị liệt kê chỉ có thể là chuỗi, số và giá trị Boolean',
      value_can_not_be_empty: 'Giá trị liệt kê không thể là giá trị null "{{item}}"',
      ranges_can_not_be_empty: 'Phạm vi liệt kê không thể trống',
      default_not_in_range: 'Giá trị mặc định "{{item}}" không nằm trong phạm vi liệt kê',
    },
    literal: {
      not_match: '{{label}} không phải là giá trị được chỉ định',
      unsupported_value: 'Chỉ hỗ trợ chuỗi, số, boolean và null',
    },
    one_of: {
      not_match_rule: '{{label}} không tuân thủ các quy tắc',
      match_multiple_rule: '{{label}} tuân thủ nhiều quy tắc',
    },
    any_of: {
      not_match_rule: '{{label}} không tuân thủ các quy tắc',
    },
    all_of: {
      not_match_all: '{{label}} không đáp ứng tất cả các quy tắc',
    },
    url: {
      must_be_url: '{{label}} phải ở định dạng URL',
      unsupported_scheme: '{{label}} chứa giao thức URL không được hỗ trợ: {{scheme}}',
    },
  },
});
