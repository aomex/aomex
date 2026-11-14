import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'ផ្លូវឯកសារកំណត់ហេតុមិនត្រឹមត្រូវ',
  webhook_request_timed_out: 'សំណើ Webhook អស់ពេល',
  webhook_request_failed: 'សំណើ Webhook បរាជ័យ ({{status}} {{statusText}})',
});
