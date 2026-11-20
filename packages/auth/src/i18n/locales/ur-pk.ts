import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-pk */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'سیشن نہیں بنایا جا سکا: لکھنے کی متعدد کوششیں ناکام ہوئیں، اسٹوریج اڈاپٹر چیک کریں',
  session_max_age_invalid: 'cookie.maxAge مثبت عدد ہونا چاہیے (سیکنڈ میں)',
});
