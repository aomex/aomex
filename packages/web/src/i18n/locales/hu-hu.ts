import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: 'A {{label}} fájlnak kell lennie',
      too_large: 'A {{label}} fájl túl nagy',
      unsupported_mimetype: 'A {{label}} fájltípus nem támogatott',
      invalid_mimetype_token: 'Érvénytelen médiatípus vagy fájlkiterjesztés: {{token}}',
    },
  },
  response: {
    redirect: 'Átirányítás ide: {{url}}',
  },
});
