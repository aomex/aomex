import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-my */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Tidak dapat mencipta sesi: beberapa percubaan menulis gagal, semak penyesuai storan',
  session_max_age_invalid: 'cookie.maxAge mestilah nombor positif (dalam saat)',
});
