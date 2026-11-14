import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: 'Ní mór {{label}} a bheith ina chomhad',
      too_large: 'Tá an comhad {{label}} ró-mhór',
      unsupported_mimetype: 'Ní thacaítear leis an gcineál comhaid {{label}}',
    },
  },
  response: {
    redirect: 'Á atreorú chuig {{url}}',
  },
});
