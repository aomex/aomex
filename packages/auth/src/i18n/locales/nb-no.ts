import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-no */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Kunne ikke opprette økt: flere skriveforsøk mislyktes, sjekk lagringsadapteren',
  session_max_age_invalid: 'cookie.maxAge må være et positivt tall (i sekunder)',
});
