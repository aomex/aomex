import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  command_not_found: 'El comando "{{command}}" no existe',
  command_found_recommended:
    'El comando "{{command}}" no existe. ¿Quieres decir "aomex {{recommended}}"?',
  help: {
    command: '[comando]',
    option: '[opciones]',
    version: 'Mostrar el número de versión de {{scriptName}}',
    no_usage: 'No se puede encontrar el uso del comando "{{command}}"',
  },
});
