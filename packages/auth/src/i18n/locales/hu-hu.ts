import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-hu */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Nem sikerült létrehozni a munkamenetet: több írási kísérlet sikertelen, ellenőrizze a tárolóadaptert',
  session_max_age_invalid: 'A cookie.maxAge pozitív szám kell legyen (másodpercben)',
});
