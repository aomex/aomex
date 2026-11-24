import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Sedema xerabîstîkirina bikarhênerê nenas: {{reason}}',
  unknown_ip_abuse_reason: 'Sedema xerabîstîkirina IP-ê nenas: {{reason}}',
  duplicate_user_abuse_reason: 'Sedema dubare ya xerabîstîkirina bikarhêner: {{reason}}',
  duplicate_ip_abuse_reason: 'Sedema dubare ya xerabîstîkirina IP: {{reason}}',
  missing_on_ban_user:
    'Dema stratejiyên user-abuse hatin mîhengkirin, onBanUser pêwîst e',
  invalid_limit: 'limit divê hejmareke temam a erênî be, hatî: {{limit}}',
  invalid_window: 'window divê demjimêreke erênî be, hatî: {{window}}',
  invalid_block_for: 'blockFor divê demjimêreke erênî be, hatî: {{blockFor}}',
  invalid_ban_for: 'banFor divê demjimêreke erênî be, hatî: {{banFor}}',
  empty_honeypot_paths: 'paths ya stratejiya honeypot nikare vala be',
  empty_http_error_status_codes: 'statusCodes ya stratejiya http-error nikare vala be',
  empty_socket_events: 'events ya stratejiya socket-events nikare vala be',
  blocked: 'Gihîştin hate redkirin',
});
