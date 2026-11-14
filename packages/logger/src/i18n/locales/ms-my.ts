import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Laluan fail log tidak sah',
  webhook_request_timed_out: 'Permintaan Webhook tamat masa',
  webhook_request_failed: 'Permintaan Webhook gagal ({{status}} {{statusText}})',
});
