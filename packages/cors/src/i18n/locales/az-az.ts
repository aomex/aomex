import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'credentials true olduqda origin açıq şəkildə təyin edilməlidir (konkret origin, ağ siyahı və ya konkret origin qaytaran funksiya); standart əks etdirmə qadağandır',
  credentials_with_wildcard_origin:
    'credentials true olduqda origin "*" ola bilməz: brauzerlər bu kombinasiyanı qəbul etmir; konkret origin, ağ siyahı və ya konkret origin qaytaran funksiya istifadə edin',
});
