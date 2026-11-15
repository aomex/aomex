import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} debe ser un ficheiro',
      too_large: 'O ficheiro {{label}} é demasiado grande',
      unsupported_mimetype: 'O tipo de ficheiro {{label}} non é compatible',
      invalid_mimetype_token:
        'Tipo de medio ou extensión de ficheiro non válida: {{token}}',
    },
  },
  response: {
    redirect: 'Redirixindo a {{url}}',
  },
});
