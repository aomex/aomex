import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  command_not_found: 'کمانڈ "{{command}}" موجود نہیں ہے۔',
  command_found_recommended:
    'کمانڈ "{{command}}" موجود نہیں ہے۔ کیا آپ کا مطلب "aomex {{recommended}}" ہے؟',
  help: {
    command: '[حکم]',
    option: '[اختیارات]',
    version: '{{scriptName}} کا ورژن نمبر دکھائیں۔',
    no_usage: '"{{command}}" کمانڈ کا استعمال نہیں مل سکتا',
  },
});
