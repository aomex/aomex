import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  initialize: 'tài liệu khởi tạo',
  search_routers_files: 'Tìm kiếm tập tin định tuyến',
  parse_routers: 'tuyến đường phân tích',
  add_tag: 'Thêm thẻ',
  hand_fix_documentation: 'Sửa chữa tài liệu theo cách thủ công',
  optimize_parameter: 'Thông số tối ưu hóa',
  save_to_file: 'lưu vào tập tin',
  validate: 'Xác minh tài liệu',
  help_summary: 'Trình tạo tài liệu OpenAPI v3',
  has_error: 'Lỗi {{error_count}}, cảnh báo {{warning_count}}',
  no_error: 'không có lỗi',
});
