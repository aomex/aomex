import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Nežinoma naudotojo piktnaudžiavimo priežastis: {{reason}}',
  unknown_ip_abuse_reason: 'Nežinoma IP piktnaudžiavimo priežastis: {{reason}}',
  duplicate_user_abuse_reason:
    'Dubliuota naudotojo piktnaudžiavimo priežastis: {{reason}}',
  duplicate_ip_abuse_reason: 'Dubliuota IP piktnaudžiavimo priežastis: {{reason}}',
  missing_on_ban_user: 'Kai sukonfigūruotos user-abuse strategijos, būtinas onBanUser',
  invalid_limit: 'limit turi būti teigiamas sveikasis skaičius, gauta: {{limit}}',
  invalid_window: 'window turi būti teigiama trukmė, gauta: {{window}}',
  invalid_block_for: 'blockFor turi būti teigiama trukmė, gauta: {{blockFor}}',
  invalid_ban_for: 'banFor turi būti teigiama trukmė, gauta: {{banFor}}',
  empty_honeypot_paths: 'honeypot strategijos paths negali būti tuščias',
  empty_http_error_status_codes: 'http-error strategijos statusCodes negali būti tuščias',
  empty_socket_events: 'socket-events strategijos events negali būti tuščias',
  blocked: 'Prieiga uždrausta',
});
