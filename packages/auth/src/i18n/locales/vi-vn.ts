import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-vn */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Không thể tạo phiên: nhiều lần ghi đều thất bại, hãy kiểm tra bộ chuyển lưu trữ',
  session_max_age_invalid: 'cookie.maxAge phải là số dương (tính bằng giây)',
});
