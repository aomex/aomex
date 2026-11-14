import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ត្រូវតែជាឯកសារ',
      too_large: 'ឯកសារ {{label}} ធំពេក',
      unsupported_mimetype: 'ប្រភេទឯកសារ {{label}} មិនត្រូវបានគាំទ្រទេ។',
    },
  },
  response: {
    redirect: 'កំពុងបញ្ជូនបន្តទៅ {{url}}',
  },
});
