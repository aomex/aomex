import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} deve ser um arquivo',
      too_large: 'O arquivo {{label}} é muito grande',
      unsupported_mimetype: 'O tipo de arquivo {{label}} não é compatível',
      invalid_mimetype_token: 'Tipo de mídia ou extensão de arquivo inválido: {{token}}',
    },
  },
  response: {
    redirect: 'Redirecionando para {{url}}',
  },
});
