import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-tr */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Oturum oluşturulamadı: birden fazla yazma denemesi başarısız oldu, depolama bağdaştırıcısını kontrol edin',
  session_max_age_invalid: 'cookie.maxAge pozitif bir sayı olmalıdır (saniye cinsinden)',
});
