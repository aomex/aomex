import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Tamaño de bytes no válido: {{value}}',
  invalid_duration: 'Duración no válida: {{value}}',
});
