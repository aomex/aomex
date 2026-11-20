import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-ro */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nu s-a putut crea sesiunea: mai multe încercări de scriere au eșuat, verificați adaptorul de stocare',
  session_max_age_invalid: 'cookie.maxAge trebuie să fie un număr pozitiv (în secunde)',
});
