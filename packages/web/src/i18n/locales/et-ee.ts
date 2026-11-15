import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} peab olema fail',
      too_large: '{{label}} -fail on liiga suur',
      unsupported_mimetype: 'Failitüüpi {{label}} ei toetata',
      invalid_mimetype_token: 'Vigane meediatüüp või faililaiend: {{token}}',
    },
  },
  response: {
    redirect: 'Suunamine aadressile {{url}}',
  },
});
