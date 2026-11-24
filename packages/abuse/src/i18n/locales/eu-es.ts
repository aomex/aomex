import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason:
    'Erabiltzailearen gehiegikeriaren arrazoi ezezaguna: {{reason}}',
  unknown_ip_abuse_reason: 'IP gehiegikeriaren arrazoi ezezaguna: {{reason}}',
  duplicate_user_abuse_reason:
    'Erabiltzailearen gehiegikeriaren arrazoi bikoiztua: {{reason}}',
  duplicate_ip_abuse_reason: 'IP gehiegikeriaren arrazoi bikoiztua: {{reason}}',
  missing_on_ban_user:
    'onBanUser beharrezkoa da user-abuse estrategiak konfiguratuta daudenean',
  invalid_limit: 'limit zenbaki oso positiboa izan behar da, jasotakoa: {{limit}}',
  invalid_window: 'window iraupen positiboa izan behar da, jasotakoa: {{window}}',
  invalid_block_for: 'blockFor iraupen positiboa izan behar da, jasotakoa: {{blockFor}}',
  invalid_ban_for: 'banFor iraupen positiboa izan behar da, jasotakoa: {{banFor}}',
  empty_honeypot_paths: 'honeypot estrategiaren paths ezin da hutsik egon',
  empty_http_error_status_codes:
    'http-error estrategiaren statusCodes ezin da hutsik egon',
  empty_socket_events: 'socket-events estrategiaren events ezin da hutsik egon',
  blocked: 'Sarbidea ukatuta',
});
