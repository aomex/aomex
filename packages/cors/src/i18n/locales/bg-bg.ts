import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'когато credentials е true, origin трябва да се зададе изрично (конкретен origin, бял списък или функция, която връща конкретен origin); отражението по подразбиране не е позволено',
  credentials_with_wildcard_origin:
    'когато credentials е true, origin не може да бъде "*": браузърите не приемат тази комбинация; използвайте конкретен origin, бял списък или функция, която връща конкретен origin',
});
