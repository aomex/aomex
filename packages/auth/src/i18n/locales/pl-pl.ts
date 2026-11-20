import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-pl */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nie można utworzyć sesji: wielokrotne próby zapisu nie powiodły się, sprawdź adapter magazynu',
  session_max_age_invalid: 'cookie.maxAge musi być liczbą dodatnią (w sekundach)',
});
