import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-hr */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nije moguće stvoriti sesiju: više pokušaja pisanja nije uspjelo, provjerite adapter pohrane',
  session_max_age_invalid: 'cookie.maxAge mora biti pozitivan broj (u sekundama)',
});
