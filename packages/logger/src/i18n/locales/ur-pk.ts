import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'لاگ فائل کا غلط راستہ',
  webhook_request_timed_out: 'Webhook درخواست کا وقت ختم',
  webhook_request_failed: 'Webhook درخواست ناکام ({{status}} {{statusText}})',
});
