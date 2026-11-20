import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Tamaño de bytes non válido: {{value}}',
  invalid_duration: 'Duración non válida: {{value}}',
});
