import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  invalid_bytes: '無効なバイトサイズ：{{value}}',
  invalid_duration: '無効な期間：{{value}}',
});
