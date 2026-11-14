import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Журнал файлының жолы жарамсыз',
  webhook_request_timed_out: 'Webhook сұрауының уақыты бітті',
  webhook_request_failed: 'Webhook сұрауы сәтсіз ({{status}} {{statusText}})',
});
