import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: "Motiu d'abús d'usuari desconegut: {{reason}}",
  unknown_ip_abuse_reason: "Motiu d'abús d'IP desconegut: {{reason}}",
  duplicate_user_abuse_reason: "Motiu d'abús d'usuari duplicat: {{reason}}",
  duplicate_ip_abuse_reason: "Motiu d'abús d'IP duplicat: {{reason}}",
  missing_on_ban_user:
    'onBanUser és obligatori quan hi ha estratègies user-abuse configurades',
  invalid_limit: 'limit ha de ser un enter positiu, rebut: {{limit}}',
  invalid_window: 'window ha de ser una durada positiva, rebut: {{window}}',
  invalid_block_for: 'blockFor ha de ser una durada positiva, rebut: {{blockFor}}',
  invalid_ban_for: 'banFor ha de ser una durada positiva, rebut: {{banFor}}',
  empty_honeypot_paths: "paths de l'estratègia honeypot no pot estar buit",
  empty_http_error_status_codes:
    "statusCodes de l'estratègia http-error no pot estar buit",
  empty_socket_events: "events de l'estratègia socket-events no pot estar buit",
  blocked: 'Accés denegat',
});
