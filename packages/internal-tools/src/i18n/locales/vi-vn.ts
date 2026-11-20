import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Kích thước byte không hợp lệ: {{value}}',
  invalid_duration: 'Thời lượng không hợp lệ: {{value}}',
});
