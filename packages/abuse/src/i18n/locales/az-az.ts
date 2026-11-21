import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Naməlum istifadəçi sui-istifadə səbəbi: {{reason}}',
  unknown_ip_abuse_reason: 'Naməlum IP sui-istifadə səbəbi: {{reason}}',
  duplicate_user_abuse_reason: 'Təkrarlanan istifadəçi sui-istifadə səbəbi: {{reason}}',
  duplicate_ip_abuse_reason: 'Təkrarlanan IP sui-istifadə səbəbi: {{reason}}',
  missing_on_ban_user:
    'user-abuse strategiyaları konfiqurasiya edildikdə onBanUser tələb olunur',
  invalid_limit: 'limit müsbət tam ədəd olmalıdır, alınan: {{limit}}',
  invalid_window: 'window müsbət müddət olmalıdır, alınan: {{window}}',
  invalid_block_for: 'blockFor müsbət müddət olmalıdır, alınan: {{blockFor}}',
  invalid_ban_for: 'banFor müsbət müddət olmalıdır, alınan: {{banFor}}',
  empty_honeypot_paths: 'honeypot strategiyasının paths boş ola bilməz',
  empty_http_error_status_codes: 'http-error strategiyasının statusCodes boş ola bilməz',
});
