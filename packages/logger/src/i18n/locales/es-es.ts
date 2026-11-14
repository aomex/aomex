import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ruta de archivo de registro no válida',
  webhook_request_timed_out: 'Tiempo de espera de solicitud Webhook agotado',
  webhook_request_failed: 'Falló la solicitud Webhook ({{status}} {{statusText}})',
});
