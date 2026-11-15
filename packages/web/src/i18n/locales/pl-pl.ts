import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} musi być plikiem',
      too_large: 'Plik {{label}} jest za duży',
      unsupported_mimetype: 'Typ pliku {{label}} nie jest obsługiwany',
      invalid_mimetype_token:
        'Nieprawidłowy typ multimediów lub rozszerzenie pliku: {{token}}',
    },
  },
  response: {
    redirect: 'Przekierowanie do {{url}}',
  },
});
