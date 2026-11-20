import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true iken origin açıkça ayarlanmalıdır (somut origin, izin listesi veya somut origin döndüren bir işlev); varsayılan yansıtma yasaktır',
  credentials_with_wildcard_origin:
    'credentials true iken origin "*" olamaz: tarayıcılar bu birleşimi kabul etmez; somut bir origin, izin listesi veya somut origin döndüren bir işlev kullanın',
});
