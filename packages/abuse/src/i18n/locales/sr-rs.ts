import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Nepoznat razlog zloupotrebe korisnika: {{reason}}',
  unknown_ip_abuse_reason: 'Nepoznat razlog zloupotrebe IP-a: {{reason}}',
  duplicate_user_abuse_reason: 'Dupliciran razlog zloupotrebe korisnika: {{reason}}',
  duplicate_ip_abuse_reason: 'Dupliciran razlog zloupotrebe IP-a: {{reason}}',
  missing_on_ban_user:
    'onBanUser je obavezan kada su konfigurisane strategije user-abuse',
  invalid_limit: 'limit mora biti pozitivan ceo broj, primljeno: {{limit}}',
  invalid_window: 'window mora biti pozitivno trajanje, primljeno: {{window}}',
  invalid_block_for: 'blockFor mora biti pozitivno trajanje, primljeno: {{blockFor}}',
  invalid_ban_for: 'banFor mora biti pozitivno trajanje, primljeno: {{banFor}}',
  empty_honeypot_paths: 'paths strategije honeypot ne sme biti prazan',
  empty_http_error_status_codes: 'statusCodes strategije http-error ne sme biti prazan',
  empty_socket_events: 'events strategije socket-events ne sme biti prazan',
  blocked: 'Приступ одбијен',
});
