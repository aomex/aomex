import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} trebuie să fie un fișier',
      too_large: 'Fișierul {{label}} este prea mare',
      unsupported_mimetype: 'Tipul de fișier {{label}} nu este acceptat',
      invalid_mimetype_token: 'Tip media sau extensie de fișier nevalidă: {{token}}',
    },
  },
  response: {
    redirect: 'Redirecționare către {{url}}',
  },
});
