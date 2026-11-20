import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'коли credentials має значення true, необхідно явно задати origin (конкретний origin, білий список або функцію, що повертає конкретний origin); віддзеркалення за замовчуванням заборонено',
  credentials_with_wildcard_origin:
    'коли credentials має значення true, origin не може бути "*": браузери не приймають цю комбінацію; вкажіть конкретний origin, білий список або функцію, що повертає конкретний origin',
});
