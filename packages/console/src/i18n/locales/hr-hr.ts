import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  command_not_found: 'Naredba "{{command}}" ne postoji',
  command_found_recommended:
    'Naredba "{{command}}" ne postoji. Mislite li "aomex {{recommended}}"?',
  help: {
    command: '[naredba]',
    option: '[opcije]',
    version: 'Prikažite broj verzije {{scriptName}}',
    no_usage: 'Nije moguće pronaći upotrebu naredbe "{{command}}".',
  },
});
