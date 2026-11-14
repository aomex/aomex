import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Nieprawidłowa ścieżka pliku dziennika',
  webhook_request_timed_out: 'Przekroczono limit czasu żądania Webhook',
  webhook_request_failed: 'Żądanie Webhook nie powiodło się ({{status}} {{statusText}})',
});
