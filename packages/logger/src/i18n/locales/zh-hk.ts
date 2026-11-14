import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: '日誌檔案路徑不合法',
  webhook_request_timed_out: 'Webhook 請求超時',
  webhook_request_failed: 'Webhook 請求失敗（{{status}} {{statusText}}）',
});
