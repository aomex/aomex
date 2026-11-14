import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} უნდა იყოს ფაილი',
      too_large: '{{label}} ფაილი ძალიან დიდია',
      unsupported_mimetype: 'ფაილის ტიპი {{label}} არ არის მხარდაჭერილი',
    },
  },
  response: {
    redirect: 'გადამისამართება {{url}} -ზე',
  },
});
