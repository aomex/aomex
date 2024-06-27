import { i18n } from '@aomex/core';

i18n.register('en_US', 'console', {
  command_not_found: 'command "{{command}}" not found',
  command_found_recommended: {
    message: 'command "{{command}}" not found, did you mean these: {{recommended}}',
    args: {
      recommended(arg) {
        return arg.join(', ');
      },
    },
  },
});
