import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-ir */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'ایجاد نشست ممکن نشد: چندین تلاش برای نوشتن ناموفق بود، آداپتر ذخیره‌سازی را بررسی کنید',
  session_max_age_invalid: 'cookie.maxAge باید عددی مثبت باشد (بر حسب ثانیه)',
});
