import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: 'يجب أن يكون {{label}} ملفًا',
      too_large: 'ملف {{label}} كبير جدًا',
      unsupported_mimetype: 'نوع الملف {{label}} غير مدعوم',
      invalid_mimetype_token: 'نوع وسائط أو امتداد ملف غير صالح: {{token}}',
    },
  },
  response: {
    redirect: 'جارٍ إعادة التوجيه إلى {{url}}',
  },
});
