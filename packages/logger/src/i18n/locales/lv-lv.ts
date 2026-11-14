import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Nederīgs žurnāla faila ceļš',
  webhook_request_timed_out: 'Webhook pieprasījuma noildze',
  webhook_request_failed: 'Webhook pieprasījums neizdevās ({{status}} {{statusText}})',
});
