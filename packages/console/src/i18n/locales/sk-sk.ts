import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  command_not_found: 'Príkaz "{{command}}" neexistuje',
  command_found_recommended:
    'Príkaz "{{command}}" neexistuje. Máte na mysli „aomex {{recommended}}“?',
  help: {
    command: '[príkaz]',
    option: '[možnosti]',
    version: 'Zobrazte číslo verzie {{scriptName}}',
    no_usage: 'Nie je možné nájsť použitie príkazu "{{command}}".',
  },
});
