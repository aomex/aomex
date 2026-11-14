import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Недопустимый путь к файлу журнала',
  webhook_request_timed_out: 'Тайм-аут запроса Webhook',
  webhook_request_failed: 'Запрос Webhook не выполнен ({{status}} {{statusText}})',
});
