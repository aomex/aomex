import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ha de ser un fitxer',
      too_large: 'El fitxer {{label}} és massa gran',
      unsupported_mimetype: 'El tipus de fitxer {{label}} no és compatible',
      invalid_mimetype_token: 'Tipus de mitjà o extensió de fitxer no vàlid: {{token}}',
    },
  },
  response: {
    redirect: 'S’està redirigint a {{url}}',
  },
});
