import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} باید یک فایل باشد',
      too_large: 'فایل {{label}} خیلی بزرگ است',
      unsupported_mimetype: 'نوع فایل {{label}} پشتیبانی نمی شود',
    },
  },
  response: {
    redirect: 'در حال تغییر مسیر به {{url}}',
  },
});
