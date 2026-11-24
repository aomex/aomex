import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Motiv necunoscut de abuz al utilizatorului: {{reason}}',
  unknown_ip_abuse_reason: 'Motiv necunoscut de abuz IP: {{reason}}',
  duplicate_user_abuse_reason: 'Motiv duplicat de abuz al utilizatorului: {{reason}}',
  duplicate_ip_abuse_reason: 'Motiv duplicat de abuz IP: {{reason}}',
  missing_on_ban_user:
    'onBanUser este obligatoriu când sunt configurate strategii user-abuse',
  invalid_limit: 'limit trebuie să fie un întreg pozitiv, primit: {{limit}}',
  invalid_window: 'window trebuie să fie o durată pozitivă, primit: {{window}}',
  invalid_block_for: 'blockFor trebuie să fie o durată pozitivă, primit: {{blockFor}}',
  invalid_ban_for: 'banFor trebuie să fie o durată pozitivă, primit: {{banFor}}',
  empty_honeypot_paths: 'paths al strategiei honeypot nu poate fi gol',
  empty_http_error_status_codes: 'statusCodes al strategiei http-error nu poate fi gol',
  empty_socket_events: 'events al strategiei socket-events nu poate fi gol',
  blocked: 'Acces interzis',
});
