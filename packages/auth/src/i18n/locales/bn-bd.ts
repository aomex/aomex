import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-bd */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'সেশন তৈরি করা যায়নি: একাধিকবার লেখার চেষ্টা ব্যর্থ হয়েছে, স্টোরেজ অ্যাডাপ্টার পরীক্ষা করুন',
  session_max_age_invalid: 'cookie.maxAge অবশ্যই ধনাত্মক সংখ্যা হতে হবে (সেকেন্ডে)',
});
