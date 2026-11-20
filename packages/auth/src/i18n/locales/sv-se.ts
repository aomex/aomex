import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-se */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Kunde inte skapa session: flera skrivförsök misslyckades, kontrollera lagringsadaptern',
  session_max_age_invalid: 'cookie.maxAge måste vara ett positivt tal (i sekunder)',
});
