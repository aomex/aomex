import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Має бути файл',
      too_large: '{{label}} Файл завеликий',
      unsupported_mimetype: 'Тип файлу {{label}} не підтримується',
      invalid_mimetype_token: 'Недійсний тип медіа або розширення файлу: {{token}}',
    },
  },
  response: {
    redirect: 'Перенаправлення на {{url}}',
  },
});
