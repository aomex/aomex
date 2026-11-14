import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Невалиден път към лог файл',
  webhook_request_timed_out: 'Заявката към Webhook изтече',
  webhook_request_failed: 'Заявката към Webhook неуспешна ({{status}} {{statusText}})',
});
