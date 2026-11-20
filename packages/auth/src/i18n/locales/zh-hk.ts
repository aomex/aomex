import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  session_create_failed: '無法建立工作階段：多次嘗試寫入均失敗，請檢查儲存適配器',
  session_max_age_invalid: 'cookie.maxAge 必須為正數（單位：秒）',
});
