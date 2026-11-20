import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'при credentials: true необходимо явно задать origin (конкретный origin, белый список или функцию, возвращающую конкретный origin); рефлексия по умолчанию запрещена',
  credentials_with_wildcard_origin:
    'при credentials: true нельзя задавать origin как "*": браузеры не принимают эту комбинацию; укажите конкретный origin, белый список или функцию, возвращающую конкретный origin',
});
