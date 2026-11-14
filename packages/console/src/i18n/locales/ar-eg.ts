import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  command_not_found: 'الأمر "{{command}}" غير موجود',
  command_found_recommended:
    'الأمر "{{command}}" غير موجود. هل تقصد "aomex {{recommended}}"؟',
  help: {
    command: '[أمر]',
    option: '[خيارات]',
    version: 'عرض رقم إصدار {{scriptName}}',
    no_usage: 'لا يمكن العثور على استخدام الأمر "{{command}}".',
  },
});
