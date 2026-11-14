import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Chemin de fichier journal non valide',
  webhook_request_timed_out: 'Délai d’attente de la requête Webhook dépassé',
  webhook_request_failed: 'Échec de la requête Webhook ({{status}} {{statusText}})',
});
