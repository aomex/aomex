import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Path file log tidak valid',
  webhook_request_timed_out: 'Permintaan Webhook kehabisan waktu',
  webhook_request_failed: 'Permintaan Webhook gagal ({{status}} {{statusText}})',
});
