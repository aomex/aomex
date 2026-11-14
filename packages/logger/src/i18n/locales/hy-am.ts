import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Անվավեր մատյանի ֆայլի ուղի',
  webhook_request_timed_out: 'Webhook հարցման ժամանակը սպառվեց',
  webhook_request_failed: 'Webhook հարցումը ձախողվեց ({{status}} {{statusText}})',
});
