import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  command_not_found: 'Skipunin „{{command}}“ er ekki til',
  command_found_recommended:
    'Skipunin „{{command}}“ er ekki til. Ertu að meina "aomex {{recommended}}"?',
  help: {
    command: '[skipun]',
    option: '[valkostir]',
    version: 'Birta útgáfunúmer {{scriptName}}',
    no_usage: 'Notkun skipunarinnar "{{command}}" er ekki að finna',
  },
});
