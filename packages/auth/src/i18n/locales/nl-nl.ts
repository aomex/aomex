import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-nl */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Kan sessie niet maken: meerdere schrijfpogingen mislukt, controleer de opslagadapter',
  session_max_age_invalid: 'cookie.maxAge moet een positief getal zijn (in seconden)',
});
