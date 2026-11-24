import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Foydalanuvchi suiisteʼmolining nomaʼlum sababi: {{reason}}',
  unknown_ip_abuse_reason: 'IP suiisteʼmolining nomaʼlum sababi: {{reason}}',
  duplicate_user_abuse_reason:
    'Foydalanuvchi suiisteʼmolining takroriy sababi: {{reason}}',
  duplicate_ip_abuse_reason: 'IP suiisteʼmolining takroriy sababi: {{reason}}',
  missing_on_ban_user: 'user-abuse strategiyalari sozlanganda onBanUser majburiy',
  invalid_limit: 'limit musbat butun son boʻlishi kerak, qabul qilindi: {{limit}}',
  invalid_window: 'window musbat davomiylik boʻlishi kerak, qabul qilindi: {{window}}',
  invalid_block_for:
    'blockFor musbat davomiylik boʻlishi kerak, qabul qilindi: {{blockFor}}',
  invalid_ban_for: 'banFor musbat davomiylik boʻlishi kerak, qabul qilindi: {{banFor}}',
  empty_honeypot_paths: 'honeypot strategiyasining paths boʻsh boʻlishi mumkin emas',
  empty_http_error_status_codes:
    'http-error strategiyasining statusCodes boʻsh boʻlishi mumkin emas',
  empty_socket_events: 'socket-events strategiyasining events boʻsh boʻlishi mumkin emas',
  blocked: 'Kirish taqiqlangan',
});
