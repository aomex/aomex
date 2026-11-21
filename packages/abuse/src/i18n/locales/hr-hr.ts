import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Nepoznat razlog zlouporabe korisnika: {{reason}}',
  unknown_ip_abuse_reason: 'Nepoznat razlog zlouporabe IP-a: {{reason}}',
  duplicate_user_abuse_reason: 'Duplicirani razlog zlouporabe korisnika: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplicirani razlog zlouporabe IP-a: {{reason}}',
  missing_on_ban_user:
    'onBanUser je obavezan kada su konfigurirane strategije user-abuse',
  invalid_limit: 'limit mora biti pozitivan cijeli broj, primljeno: {{limit}}',
  invalid_window: 'window mora biti pozitivno trajanje, primljeno: {{window}}',
  invalid_block_for: 'blockFor mora biti pozitivno trajanje, primljeno: {{blockFor}}',
  invalid_ban_for: 'banFor mora biti pozitivno trajanje, primljeno: {{banFor}}',
  empty_honeypot_paths: 'paths strategije honeypot ne smije biti prazan',
  empty_http_error_status_codes: 'statusCodes strategije http-error ne smije biti prazan',
});
