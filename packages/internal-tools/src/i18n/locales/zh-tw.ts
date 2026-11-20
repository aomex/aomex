import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  invalid_bytes: '無效的位元組大小：{{value}}',
  invalid_duration: '無效的時長：{{value}}',
});
