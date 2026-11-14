import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  command_not_found: 'Il comando "{{command}}" non esiste',
  command_found_recommended:
    'Il comando "{{command}}" non esiste. Intendi "aomex {{recommended}}"?',
  help: {
    command: '[comando]',
    option: '[opzioni]',
    version: 'Visualizza il numero di versione di {{scriptName}}',
    no_usage: 'Impossibile trovare l\'utilizzo del comando "{{command}}".',
  },
});
