import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true bo‘lganda origin aniq sozlanishi kerak (aniq origin, oq ro‘yxat yoki aniq origin qaytaradigan funksiya); standart aks ettirish taqiqlanadi',
  credentials_with_wildcard_origin:
    'credentials true bo‘lganda origin "*" bo‘lishi mumkin emas: brauzerlar bu kombinatsiyani qabul qilmaydi; aniq origin, oq ro‘yxat yoki aniq origin qaytaradigan funksiyadan foydalaning',
});
