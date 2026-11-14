import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'अमान्य लग फाइल पथ',
  webhook_request_timed_out: 'Webhook अनुरोध समय सकियो',
  webhook_request_failed: 'Webhook अनुरोध असफल ({{status}} {{statusText}})',
});
