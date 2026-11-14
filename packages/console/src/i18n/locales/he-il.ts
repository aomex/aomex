import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  command_not_found: 'הפקודה "{{command}}" לא קיימת',
  command_found_recommended:
    'הפקודה "{{command}}" לא קיימת. האם אתה מתכוון ל"aomex {{recommended}}"?',
  help: {
    command: '[פקודה]',
    option: '[אפשרויות]',
    version: 'הצג את מספר הגרסה של {{scriptName}}',
    no_usage: 'לא ניתן למצוא את השימוש בפקודה "{{command}}".',
  },
});
