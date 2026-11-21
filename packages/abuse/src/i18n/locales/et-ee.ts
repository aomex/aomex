import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Tundmatu kasutaja väärkasutuse põhjus: {{reason}}',
  unknown_ip_abuse_reason: 'Tundmatu IP väärkasutuse põhjus: {{reason}}',
  duplicate_user_abuse_reason: 'Korduv kasutaja väärkasutuse põhjus: {{reason}}',
  duplicate_ip_abuse_reason: 'Korduv IP väärkasutuse põhjus: {{reason}}',
  missing_on_ban_user:
    'Kui on seadistatud user-abuse strateegiad, on onBanUser kohustuslik',
  invalid_limit: 'limit peab olema positiivne täisarv, saadud: {{limit}}',
  invalid_window: 'window peab olema positiivne kestus, saadud: {{window}}',
  invalid_block_for: 'blockFor peab olema positiivne kestus, saadud: {{blockFor}}',
  invalid_ban_for: 'banFor peab olema positiivne kestus, saadud: {{banFor}}',
  empty_honeypot_paths: 'honeypot strateegia paths ei tohi olla tühi',
  empty_http_error_status_codes: 'http-error strateegia statusCodes ei tohi olla tühi',
});
