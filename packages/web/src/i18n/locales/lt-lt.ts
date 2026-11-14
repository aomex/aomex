import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} turi būti failas',
      too_large: '{{label}} failas per didelis',
      unsupported_mimetype: 'Failo tipas {{label}} nepalaikomas',
    },
  },
  response: {
    redirect: 'Nukreipiama į {{url}}',
  },
});
