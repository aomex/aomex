import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} musí byť súbor',
      too_large: 'Súbor {{label}} je príliš veľký',
      unsupported_mimetype: 'Typ súboru {{label}} nie je podporovaný',
    },
  },
  response: {
    redirect: 'Presmerovanie na {{url}}',
  },
});
