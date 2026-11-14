import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Недійсний шлях до файлу журналу',
  webhook_request_timed_out: 'Тайм-аут запиту Webhook',
  webhook_request_failed: 'Запит Webhook не вдався ({{status}} {{statusText}})',
});
