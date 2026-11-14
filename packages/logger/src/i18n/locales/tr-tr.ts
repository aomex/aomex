import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Geçersiz günlük dosyası yolu',
  webhook_request_timed_out: 'Webhook isteği zaman aşımı',
  webhook_request_failed: 'Webhook isteği başarısız ({{status}} {{statusText}})',
});
