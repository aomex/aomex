import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Camí del fitxer de registre no vàlid',
  webhook_request_timed_out: 'S’ha esgotat el temps de la sol·licitud Webhook',
  webhook_request_failed: 'Ha fallat la sol·licitud Webhook ({{status}} {{statusText}})',
});
