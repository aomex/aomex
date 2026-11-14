import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  command_not_found: 'Příkaz "{{command}}" neexistuje',
  command_found_recommended:
    'Příkaz "{{command}}" neexistuje. Myslíte "aomex {{recommended}}"?',
  help: {
    command: '[příkaz]',
    option: '[možnosti]',
    version: 'Zobrazte číslo verze {{scriptName}}',
    no_usage: 'Použití příkazu "{{command}}" nelze nalézt',
  },
});
