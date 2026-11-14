import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  command_not_found: 'Командата "{{command}}" не съществува',
  command_found_recommended:
    'Командата "{{command}}" не съществува. Имате предвид „aomex {{recommended}}“?',
  help: {
    command: '[команда]',
    option: '[опции]',
    version: 'Покажете номера на версията на {{scriptName}}',
    no_usage: 'Използването на командата "{{command}}" не може да бъде намерено',
  },
});
