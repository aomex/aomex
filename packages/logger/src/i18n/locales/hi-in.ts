import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'अमान्य लॉग फ़ाइल पथ',
  webhook_request_timed_out: 'Webhook अनुरोध समय समाप्त',
  webhook_request_failed: 'Webhook अनुरोध विफल ({{status}} {{statusText}})',
});
