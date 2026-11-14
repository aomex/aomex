import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  command_not_found: 'Lệnh "{{command}}" không tồn tại',
  command_found_recommended:
    'Lệnh "{{command}}" không tồn tại. Ý bạn là "aomex {{recommended}}"?',
  help: {
    command: '[lệnh]',
    option: '[tùy chọn]',
    version: 'Hiển thị số phiên bản của {{scriptName}}',
    no_usage: 'Không thể tìm thấy cách sử dụng lệnh "{{command}}"',
  },
});
