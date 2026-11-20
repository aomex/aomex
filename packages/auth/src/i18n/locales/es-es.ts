import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-es */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'No se pudo crear la sesión: fallaron varios intentos de escritura, compruebe el adaptador de almacenamiento',
  session_max_age_invalid: 'cookie.maxAge debe ser un número positivo (en segundos)',
});
