import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-es */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Non se puido crear a sesión: fallaron varios intentos de escritura, comprobe o adaptador de almacenamento',
  session_max_age_invalid: 'cookie.maxAge debe ser un número positivo (en segundos)',
});
