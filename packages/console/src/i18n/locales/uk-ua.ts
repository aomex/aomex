import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  command_not_found: 'Команди "{{command}}" не існує',
  command_found_recommended:
    'Команди "{{command}}" не існує. Ви маєте на увазі "aomex {{recommended}}"?',
  help: {
    command: '[команда]',
    option: '[опції]',
    version: 'Відобразити номер версії {{scriptName}}',
    no_usage: 'Використання команди "{{command}}" не знайдено',
  },
});
