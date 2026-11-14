import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  command_not_found: 'Ukaz "{{command}}" ne obstaja',
  command_found_recommended:
    'Ukaz "{{command}}" ne obstaja. Ali mislite "aomex {{recommended}}"?',
  help: {
    command: '[ukaz]',
    option: '[možnosti]',
    version: 'Prikažite številko različice {{scriptName}}',
    no_usage: 'Uporabe ukaza "{{command}}" ni mogoče najti',
  },
});
