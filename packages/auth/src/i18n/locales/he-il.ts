import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-il */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'לא ניתן ליצור הפעלה: ניסיונות כתיבה מרובים נכשלו, בדוק את מתאם האחסון',
  session_max_age_invalid: 'cookie.maxAge חייב להיות מספר חיובי (בשניות)',
});
