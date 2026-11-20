import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'جب credentials true ہو تو origin واضح طور پر سیٹ کرنا ضروری ہے (مخصوص origin، اجازت نامہ، یا مخصوص origin واپس کرنے والا فنکشن)؛ ڈیفالٹ انعکاس کی اجازت نہیں',
  credentials_with_wildcard_origin:
    'جب credentials true ہو تو origin "*" نہیں ہو سکتا: براؤزر یہ مجموعہ قبول نہیں کرتے؛ مخصوص origin، اجازت نامہ، یا مخصوص origin واپس کرنے والا فنکشن استعمال کریں',
});
