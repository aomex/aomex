import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Sebab penyalahgunaan pengguna tidak diketahui: {{reason}}',
  unknown_ip_abuse_reason: 'Sebab penyalahgunaan IP tidak diketahui: {{reason}}',
  duplicate_user_abuse_reason: 'Sebab penyalahgunaan pengguna berulang: {{reason}}',
  duplicate_ip_abuse_reason: 'Sebab penyalahgunaan IP berulang: {{reason}}',
  missing_on_ban_user: 'onBanUser diperlukan apabila strategi user-abuse dikonfigurasi',
  invalid_limit: 'limit mestilah integer positif, diterima: {{limit}}',
  invalid_window: 'window mestilah tempoh positif, diterima: {{window}}',
  invalid_block_for: 'blockFor mestilah tempoh positif, diterima: {{blockFor}}',
  invalid_ban_for: 'banFor mestilah tempoh positif, diterima: {{banFor}}',
  empty_honeypot_paths: 'paths strategi honeypot tidak boleh kosong',
  empty_http_error_status_codes: 'statusCodes strategi http-error tidak boleh kosong',
});
