import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} deve essere un file',
      too_large: 'Il file {{label}} è troppo grande',
      unsupported_mimetype: 'Il tipo di file {{label}} non è supportato',
      invalid_mimetype_token: 'Tipo di media o estensione file non valido: {{token}}',
    },
  },
  response: {
    redirect: 'Reindirizzamento a {{url}}',
  },
});
