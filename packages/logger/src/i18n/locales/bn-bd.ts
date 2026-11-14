import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'লগ ফাইলের পথ অবৈধ',
  webhook_request_timed_out: 'Webhook অনুরোধ সময়োত্তীর্ণ',
  webhook_request_failed: 'Webhook অনুরোধ ব্যর্থ ({{status}} {{statusText}})',
});
