import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  command_not_found: 'Командата „{{command}}“ не постои',
  command_found_recommended:
    'Командата „{{command}}“ не постои. Мислиш на „aomex {{recommended}}“?',
  help: {
    command: '[команда]',
    option: '[опции]',
    version: 'Прикажете го бројот на верзијата на {{scriptName}}',
    no_usage: 'Употребата на командата „{{command}}“ не може да се најде',
  },
});
