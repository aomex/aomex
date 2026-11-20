import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-id */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Tidak dapat membuat sesi: beberapa percobaan penulisan gagal, periksa adaptor penyimpanan',
  session_max_age_invalid: 'cookie.maxAge harus berupa angka positif (dalam detik)',
});
