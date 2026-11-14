import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} мора да биде датотека',
      too_large: '{{label}} датотеката е преголема',
      unsupported_mimetype: 'Типот на датотека {{label}} не е поддржан',
    },
  },
  response: {
    redirect: 'Пре насочување кон {{url}}',
  },
});
