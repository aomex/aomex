import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Neznan razlog zlorabe uporabnika: {{reason}}',
  unknown_ip_abuse_reason: 'Neznan razlog zlorabe IP: {{reason}}',
  duplicate_user_abuse_reason: 'Podvojen razlog zlorabe uporabnika: {{reason}}',
  duplicate_ip_abuse_reason: 'Podvojen razlog zlorabe IP: {{reason}}',
  missing_on_ban_user: 'onBanUser je obvezen, ko so konfigurirane strategije user-abuse',
  invalid_limit: 'limit mora biti pozitivno celo število, prejeto: {{limit}}',
  invalid_window: 'window mora biti pozitivno trajanje, prejeto: {{window}}',
  invalid_block_for: 'blockFor mora biti pozitivno trajanje, prejeto: {{blockFor}}',
  invalid_ban_for: 'banFor mora biti pozitivno trajanje, prejeto: {{banFor}}',
  empty_honeypot_paths: 'paths strategije honeypot ne sme biti prazen',
  empty_http_error_status_codes: 'statusCodes strategije http-error ne sme biti prazen',
  empty_socket_events: 'events strategije socket-events ne sme biti prazen',
  blocked: 'Dostop zavrnjen',
});
