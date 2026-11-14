import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  command_not_found: 'Comanda „{{command}}” nu există',
  command_found_recommended:
    'Comanda „{{command}}” nu există. Vrei să spui „aomex {{recommended}}”?',
  help: {
    command: '[comandă]',
    option: '[opțiuni]',
    version: 'Afișați numărul versiunii {{scriptName}}',
    no_usage: 'Utilizarea comenzii „{{command}}” nu poate fi găsită',
  },
});
