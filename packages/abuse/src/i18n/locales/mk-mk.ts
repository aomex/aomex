import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Непозната причина за злоупотреба од корисник: {{reason}}',
  unknown_ip_abuse_reason: 'Непозната причина за злоупотреба на IP: {{reason}}',
  duplicate_user_abuse_reason: 'Дуплирана причина за злоупотреба од корисник: {{reason}}',
  duplicate_ip_abuse_reason: 'Дуплирана причина за злоупотреба на IP: {{reason}}',
  missing_on_ban_user:
    'onBanUser е задолжителен кога се конфигурирани стратегии user-abuse',
  invalid_limit: 'limit мора да биде позитивен цел број, примено: {{limit}}',
  invalid_window: 'window мора да биде позитивно времетраење, примено: {{window}}',
  invalid_block_for: 'blockFor мора да биде позитивно времетраење, примено: {{blockFor}}',
  invalid_ban_for: 'banFor мора да биде позитивно времетраење, примено: {{banFor}}',
  empty_honeypot_paths: 'paths на стратегијата honeypot не смее да биде празен',
  empty_http_error_status_codes:
    'statusCodes на стратегијата http-error не смее да биде празен',
});
