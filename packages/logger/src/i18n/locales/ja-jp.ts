import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'ログファイルのパスが不正です',
  webhook_request_timed_out: 'Webhook リクエストがタイムアウトしました',
  webhook_request_failed: 'Webhook リクエストに失敗しました（{{status}} {{statusText}}）',
});
