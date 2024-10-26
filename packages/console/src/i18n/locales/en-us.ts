import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  command_not_found: 'command "{{command}}" not found',
  command_found_recommended:
    'command "{{command}}" not found, did you mean "aomex {{recommended}}"?',
  help: {
    command: '[command]',
    option: '[options]',
    version: 'show version of {{scriptName}}',
    no_usage: 'no usage of command "{{command}}"',
  },
});
