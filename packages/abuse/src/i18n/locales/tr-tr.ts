import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Bilinmeyen kullanıcı kötüye kullanım nedeni: {{reason}}',
  unknown_ip_abuse_reason: 'Bilinmeyen IP kötüye kullanım nedeni: {{reason}}',
  duplicate_user_abuse_reason: 'Yinelenen kullanıcı kötüye kullanım nedeni: {{reason}}',
  duplicate_ip_abuse_reason: 'Yinelenen IP kötüye kullanım nedeni: {{reason}}',
  missing_on_ban_user: 'user-abuse stratejileri yapılandırıldığında onBanUser zorunludur',
  invalid_limit: 'limit pozitif bir tam sayı olmalıdır, alınan: {{limit}}',
  invalid_window: 'window pozitif bir süre olmalıdır, alınan: {{window}}',
  invalid_block_for: 'blockFor pozitif bir süre olmalıdır, alınan: {{blockFor}}',
  invalid_ban_for: 'banFor pozitif bir süre olmalıdır, alınan: {{banFor}}',
  empty_honeypot_paths: 'honeypot stratejisinin paths değeri boş olamaz',
  empty_http_error_status_codes: 'http-error stratejisinin statusCodes değeri boş olamaz',
});
