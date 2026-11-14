import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} peab olema fail',
      too_large: '{{label}} -fail on liiga suur',
      unsupported_mimetype: 'Failitüüpi {{label}} ei toetata',
    },
  },
  response: {
    redirect: 'Suunamine aadressile {{url}}',
  },
});
