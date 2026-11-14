import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Caminho de ficheiro de registo inválido',
  webhook_request_timed_out: 'Tempo esgotado no pedido Webhook',
  webhook_request_failed: 'Falha no pedido Webhook ({{status}} {{statusText}})',
});
