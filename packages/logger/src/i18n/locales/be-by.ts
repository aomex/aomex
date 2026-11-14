import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Несапраўдны шлях да файла журнала',
  webhook_request_timed_out: 'Тайм-аўт запыту Webhook',
  webhook_request_failed: 'Запыт Webhook не ўдаўся ({{status}} {{statusText}})',
});
