import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Ismeretlen felhasználói visszaélési ok: {{reason}}',
  unknown_ip_abuse_reason: 'Ismeretlen IP-visszaélési ok: {{reason}}',
  duplicate_user_abuse_reason: 'Ismétlődő felhasználói visszaélési ok: {{reason}}',
  duplicate_ip_abuse_reason: 'Ismétlődő IP-visszaélési ok: {{reason}}',
  missing_on_ban_user:
    'Az onBanUser megadása kötelező, ha user-abuse stratégiák vannak beállítva',
  invalid_limit: 'A limitnek pozitív egész számnak kell lennie, kapott: {{limit}}',
  invalid_window: 'A windownak pozitív időtartamnak kell lennie, kapott: {{window}}',
  invalid_block_for:
    'A blockFornak pozitív időtartamnak kell lennie, kapott: {{blockFor}}',
  invalid_ban_for: 'A banFornak pozitív időtartamnak kell lennie, kapott: {{banFor}}',
  empty_honeypot_paths: 'A honeypot stratégia paths értéke nem lehet üres',
  empty_http_error_status_codes:
    'A http-error stratégia statusCodes értéke nem lehet üres',
  empty_socket_events: 'A socket-events stratégia events értéke nem lehet üres',
  blocked: 'Hozzáférés megtagadva',
});
