import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason:
    'Неизвестна причина за злоупотреба от потребител: {{reason}}',
  unknown_ip_abuse_reason: 'Неизвестна причина за злоупотреба с IP: {{reason}}',
  duplicate_user_abuse_reason:
    'Дублирана причина за злоупотреба от потребител: {{reason}}',
  duplicate_ip_abuse_reason: 'Дублирана причина за злоупотреба с IP: {{reason}}',
  missing_on_ban_user:
    'onBanUser е задължителен, когато са конфигурирани стратегии user-abuse',
  invalid_limit: 'limit трябва да бъде положително цяло число, получено: {{limit}}',
  invalid_window:
    'window трябва да бъде положителна продължителност, получено: {{window}}',
  invalid_block_for:
    'blockFor трябва да бъде положителна продължителност, получено: {{blockFor}}',
  invalid_ban_for:
    'banFor трябва да бъде положителна продължителност, получено: {{banFor}}',
  empty_honeypot_paths: 'paths на стратегията honeypot не може да бъде празен',
  empty_http_error_status_codes:
    'statusCodes на стратегията http-error не може да бъде празен',
});
