import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ruta de ficheiro de rexistro non válida',
  webhook_request_timed_out: 'Esgotouse o tempo da solicitude Webhook',
  webhook_request_failed: 'Fallou a solicitude Webhook ({{status}} {{statusText}})',
});
