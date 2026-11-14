import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  command_not_found: 'O comando "{{command}}" non existe',
  command_found_recommended:
    'O comando "{{command}}" non existe. Queres dicir "aomex {{recommended}}"?',
  help: {
    command: '[comando]',
    option: '[opcións]',
    version: 'Mostra o número de versión de {{scriptName}}',
    no_usage: 'Non se pode atopar o uso do comando "{{command}}".',
  },
});
