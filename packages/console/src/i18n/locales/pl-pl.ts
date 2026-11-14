import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  command_not_found: 'Polecenie „{{command}}” nie istnieje',
  command_found_recommended:
    'Polecenie „{{command}}” nie istnieje. Czy chodziło Ci o "aomex {{recommended}}"?',
  help: {
    command: '[polecenie]',
    option: '[opcje]',
    version: 'Wyświetl numer wersji {{scriptName}}',
    no_usage: 'Nie można znaleźć użycia polecenia „{{command}}”.',
  },
});
