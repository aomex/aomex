import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-eg */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'تعذر إنشاء الجلسة: فشلت محاولات الكتابة المتعددة، يرجى التحقق من محول التخزين',
  session_max_age_invalid: 'يجب أن يكون cookie.maxAge رقمًا موجبًا (بالثواني)',
});
