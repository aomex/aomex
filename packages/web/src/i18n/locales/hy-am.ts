import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} -ը պետք է լինի ֆայլ',
      too_large: '{{label}} ֆայլը չափազանց մեծ է',
      unsupported_mimetype: '{{label}} ֆայլի տեսակը չի աջակցվում',
    },
  },
  response: {
    redirect: 'Վերաուղղորդում դեպի {{url}}',
  },
});
