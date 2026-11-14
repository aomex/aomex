import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  command_not_found: 'Команда «{{command}}» не существует.',
  command_found_recommended:
    'Команды «{{command}}» не существует. Вы имеете в виду "aomex {{recommended}}"?',
  help: {
    command: '[команда]',
    option: '[варианты]',
    version: 'Отображение номера версии {{scriptName}}',
    no_usage: 'Использование команды «{{command}}» не обнаружено.',
  },
});
