import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Ulanyjynyň nädogry ulanyşynyň näbelli sebäbi: {{reason}}',
  unknown_ip_abuse_reason: 'IP-niň nädogry ulanyşynyň näbelli sebäbi: {{reason}}',
  duplicate_user_abuse_reason:
    'Ulanyjynyň nädogry ulanyşynyň gaýtalanýan sebäbi: {{reason}}',
  duplicate_ip_abuse_reason: 'IP-niň nädogry ulanyşynyň gaýtalanýan sebäbi: {{reason}}',
  missing_on_ban_user: 'user-abuse strategiýalary sazlananda onBanUser hökmanydyr',
  invalid_limit: 'limit oňyn bitin san bolmaly, alynan: {{limit}}',
  invalid_window: 'window oňyn dowamlylyk bolmaly, alynan: {{window}}',
  invalid_block_for: 'blockFor oňyn dowamlylyk bolmaly, alynan: {{blockFor}}',
  invalid_ban_for: 'banFor oňyn dowamlylyk bolmaly, alynan: {{banFor}}',
  empty_honeypot_paths: 'honeypot strategiýasynyň paths boş bolup bilmez',
  empty_http_error_status_codes:
    'http-error strategiýasynyň statusCodes boş bolup bilmez',
  empty_socket_events: 'socket-events strategiýasynyň events boş bolup bilmez',
  blocked: 'Giriş gadagan',
});
