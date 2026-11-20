import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-ge */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'სესიის შექმნა ვერ მოხერხდა: ჩაწერის რამდენიმე მცდელობა წარუმატებელი იყო, შეამოწმეთ შენახვის ადაპტერი',
  session_max_age_invalid: 'cookie.maxAge უნდა იყოს დადებითი რიცხვი (წამებში)',
});
