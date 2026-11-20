import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'မမှန်ကန်သော ဘိုက်အရွယ်အစား: {{value}}',
  invalid_duration: 'မမှန်ကန်သော ကြာချိန်: {{value}}',
});
