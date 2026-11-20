import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials 為 true 時必須顯式配置 origin（具體來源、白名單或回傳具體來源的函式），禁止依賴預設反射',
  credentials_with_wildcard_origin:
    'credentials 為 true 時禁止 origin 為 "*"：瀏覽器不認該組合，請改為具體來源、白名單或回傳具體來源的函式',
});
