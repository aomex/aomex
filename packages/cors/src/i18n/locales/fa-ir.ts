import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'وقتی credentials برابر true است باید origin را صریحاً تنظیم کنید (مبدأ مشخص، فهرست مجاز یا تابعی که مبدأ مشخص برمی‌گرداند)؛ بازتاب پیش‌فرض مجاز نیست',
  credentials_with_wildcard_origin:
    'وقتی credentials برابر true است، origin نمی‌تواند "*" باشد: مرورگرها این ترکیب را نمی‌پذیرند؛ از یک مبدأ مشخص، فهرست مجاز یا تابعی که مبدأ مشخص برمی‌گرداند استفاده کنید',
});
