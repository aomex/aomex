import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  command_not_found: 'L\'ordre "{{command}}" no existeix',
  command_found_recommended:
    'L\'ordre "{{command}}" no existeix. Voleu dir "aomex {{recommended}}"?',
  help: {
    command: '[ordre]',
    option: '[opcions]',
    version: 'Mostra el número de versió de {{scriptName}}',
    no_usage: 'No es pot trobar l\'ús de l\'ordre "{{command}}".',
  },
});
