import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Caminho de arquivo de log inválido',
  webhook_request_timed_out: 'Tempo esgotado na requisição Webhook',
  webhook_request_failed: 'Falha na requisição Webhook ({{status}} {{statusText}})',
});
