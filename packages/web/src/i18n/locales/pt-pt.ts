import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} deve ser um ficheiro',
      too_large: 'O ficheiro {{label}} é muito grande',
      unsupported_mimetype: 'O tipo de ficheiro {{label}} não é compatível',
      invalid_mimetype_token: 'Tipo de média ou extensão de ficheiro inválido: {{token}}',
    },
  },
  response: {
    redirect: 'A redirecionar para {{url}}',
  },
});
