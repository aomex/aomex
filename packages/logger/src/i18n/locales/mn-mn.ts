import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Хүчингүй лог файлын зам',
  webhook_request_timed_out: 'Webhook хүсэлтийн хугацаа дууссан',
  webhook_request_failed: 'Webhook хүсэлт амжилтгүй ({{status}} {{statusText}})',
});
