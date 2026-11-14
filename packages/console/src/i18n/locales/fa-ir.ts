import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  command_not_found: 'دستور "{{command}}" وجود ندارد',
  command_found_recommended:
    'دستور "{{command}}" وجود ندارد. منظورتان "aomex {{recommended}}" است؟',
  help: {
    command: '[فرمان]',
    option: '[گزینه ها]',
    version: 'نمایش شماره نسخه {{scriptName}}',
    no_usage: 'استفاده از دستور "{{command}}" یافت نمی شود',
  },
});
