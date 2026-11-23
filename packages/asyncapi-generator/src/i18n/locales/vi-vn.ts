import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  initialize: 'tài liệu khởi tạo',
  search_channels_files: 'tìm tệp Channel',
  parse_channels: 'phân tích Channel',
  hand_fix_documentation: 'Sửa chữa tài liệu theo cách thủ công',
  save_to_file: 'lưu vào tập tin',
  validate: 'Xác minh tài liệu',
  help_summary: 'Trình tạo tài liệu AsyncAPI 3',
  has_error: 'Lỗi {{error_count}}, cảnh báo {{warning_count}}',
  no_error: 'không có lỗi',
});
