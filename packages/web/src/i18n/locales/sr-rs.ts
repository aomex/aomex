import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Мора бити датотека',
      too_large: '{{label}} Датотека је превелика',
      unsupported_mimetype: 'Тип датотеке {{label}} није подржан',
      invalid_mimetype_token: 'Неважећи тип медија или екстензија датотеке: {{token}}',
    },
  },
  response: {
    redirect: 'Preusmeravanje na {{url}}',
  },
});
