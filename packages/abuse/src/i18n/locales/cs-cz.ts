import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Neznámý důvod zneužití uživatele: {{reason}}',
  unknown_ip_abuse_reason: 'Neznámý důvod zneužití IP: {{reason}}',
  duplicate_user_abuse_reason: 'Duplicitní důvod zneužití uživatele: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplicitní důvod zneužití IP: {{reason}}',
  missing_on_ban_user:
    'Pokud jsou nakonfigurovány strategie user-abuse, je vyžadováno onBanUser',
  invalid_limit: 'limit musí být kladné celé číslo, obdrženo: {{limit}}',
  invalid_window: 'window musí být kladná doba, obdrženo: {{window}}',
  invalid_block_for: 'blockFor musí být kladná doba, obdrženo: {{blockFor}}',
  invalid_ban_for: 'banFor musí být kladná doba, obdrženo: {{banFor}}',
  empty_honeypot_paths: 'paths strategie honeypot nesmí být prázdné',
  empty_http_error_status_codes: 'statusCodes strategie http-error nesmí být prázdné',
  empty_socket_events: 'events strategie socket-events nesmí být prázdné',
  blocked: 'Přístup odepřen',
});
