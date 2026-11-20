import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-dk */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Kunne ikke oprette session: flere skriveforsøg mislykkedes, tjek lageradapteren',
  session_max_age_invalid: 'cookie.maxAge skal være et positivt tal (i sekunder)',
});
