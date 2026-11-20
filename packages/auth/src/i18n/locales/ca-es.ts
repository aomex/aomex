import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-es */
export default I18n.satisfies(zh).define({
  session_create_failed:
    "No s'ha pogut crear la sessió: han fallat diversos intents d'escriptura, comproveu l'adaptador d'emmagatzematge",
  session_max_age_invalid: 'cookie.maxAge ha de ser un nombre positiu (en segons)',
});
