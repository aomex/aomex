import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-de */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Sitzung konnte nicht erstellt werden: Mehrere Schreibversuche sind fehlgeschlagen, bitte den Speicheradapter prüfen',
  session_max_age_invalid: 'cookie.maxAge muss eine positive Zahl sein (in Sekunden)',
});
