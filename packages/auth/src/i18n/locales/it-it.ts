import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-it */
export default I18n.satisfies(zh).define({
  session_create_failed:
    "Impossibile creare la sessione: diversi tentativi di scrittura non riusciti, controllare l'adattatore di archiviazione",
  session_max_age_invalid: 'cookie.maxAge deve essere un numero positivo (in secondi)',
});
