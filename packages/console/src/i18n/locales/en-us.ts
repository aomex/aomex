import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  command_not_found: 'Command "{{command}}" does not exist',
  command_found_recommended:
    'Command "{{command}}" does not exist. Did you mean "aomex {{recommended}}"?',
  help: {
    command: '[command]',
    option: '[options]',
    version: 'Show the version of {{scriptName}}',
    no_usage: 'No usage found for command "{{command}}"',
  },
});
