import { i18n } from '@aomex/core';

i18n.register('en_US', 'console', {
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
