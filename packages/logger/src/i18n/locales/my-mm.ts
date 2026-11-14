import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'မှားယွင်းသော မှတ်တမ်းဖိုင်လမ်းကြောင်း',
  webhook_request_timed_out: 'Webhook တောင်းဆိုမှု အချိန်ကုန်',
  webhook_request_failed: 'Webhook တောင်းဆိုမှု မအောင်မြင် ({{status}} {{statusText}})',
});
