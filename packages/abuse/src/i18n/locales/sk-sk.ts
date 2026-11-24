import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Neznámy dôvod zneužitia používateľa: {{reason}}',
  unknown_ip_abuse_reason: 'Neznámy dôvod zneužitia IP: {{reason}}',
  duplicate_user_abuse_reason: 'Duplicitný dôvod zneužitia používateľa: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplicitný dôvod zneužitia IP: {{reason}}',
  missing_on_ban_user:
    'Ak sú nakonfigurované stratégie user-abuse, je vyžadované onBanUser',
  invalid_limit: 'limit musí byť kladné celé číslo, prijaté: {{limit}}',
  invalid_window: 'window musí byť kladná doba, prijaté: {{window}}',
  invalid_block_for: 'blockFor musí byť kladná doba, prijaté: {{blockFor}}',
  invalid_ban_for: 'banFor musí byť kladná doba, prijaté: {{banFor}}',
  empty_honeypot_paths: 'paths stratégie honeypot nesmie byť prázdne',
  empty_http_error_status_codes: 'statusCodes stratégie http-error nesmie byť prázdne',
  empty_socket_events: 'events stratégie socket-events nesmie byť prázdne',
  blocked: 'Prístup zamietnutý',
});
