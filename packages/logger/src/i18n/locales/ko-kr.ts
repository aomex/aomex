import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: '잘못된 로그 파일 경로',
  webhook_request_timed_out: 'Webhook 요청 시간 초과',
  webhook_request_failed: 'Webhook 요청 실패 ({{status}} {{statusText}})',
});
