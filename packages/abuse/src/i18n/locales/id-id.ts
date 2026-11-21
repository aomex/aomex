import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Alasan penyalahgunaan pengguna tidak dikenal: {{reason}}',
  unknown_ip_abuse_reason: 'Alasan penyalahgunaan IP tidak dikenal: {{reason}}',
  duplicate_user_abuse_reason: 'Alasan penyalahgunaan pengguna duplikat: {{reason}}',
  duplicate_ip_abuse_reason: 'Alasan penyalahgunaan IP duplikat: {{reason}}',
  missing_on_ban_user: 'onBanUser wajib ada saat strategi user-abuse dikonfigurasi',
  invalid_limit: 'limit harus bilangan bulat positif, diterima: {{limit}}',
  invalid_window: 'window harus durasi positif, diterima: {{window}}',
  invalid_block_for: 'blockFor harus durasi positif, diterima: {{blockFor}}',
  invalid_ban_for: 'banFor harus durasi positif, diterima: {{banFor}}',
  empty_honeypot_paths: 'paths strategi honeypot tidak boleh kosong',
  empty_http_error_status_codes: 'statusCodes strategi http-error tidak boleh kosong',
});
