import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Kehtetu logifaili tee',
  webhook_request_timed_out: 'Webhooki päring aegus',
  webhook_request_failed: 'Webhooki päring ebaõnnestus ({{status}} {{statusText}})',
});
