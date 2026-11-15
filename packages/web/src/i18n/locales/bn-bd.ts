import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} একটি ফাইল হতে হবে',
      too_large: '{{label}} ফাইলটি খুব বড়',
      unsupported_mimetype: 'ফাইল প্রকার {{label}} সমর্থিত নয়৷',
      invalid_mimetype_token: 'অবৈধ মিডিয়া ধরন বা ফাইল এক্সটেনশন: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} -এ পুনর্নির্দেশ করা হচ্ছে',
  },
});
