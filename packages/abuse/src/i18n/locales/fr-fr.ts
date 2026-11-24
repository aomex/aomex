import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: "Raison d'abus utilisateur inconnue : {{reason}}",
  unknown_ip_abuse_reason: "Raison d'abus IP inconnue : {{reason}}",
  duplicate_user_abuse_reason: "Raison d'abus utilisateur en double : {{reason}}",
  duplicate_ip_abuse_reason: "Raison d'abus IP en double : {{reason}}",
  missing_on_ban_user:
    'onBanUser est requis lorsque des stratégies user-abuse sont configurées',
  invalid_limit: 'limit doit être un entier positif, reçu : {{limit}}',
  invalid_window: 'window doit être une durée positive, reçu : {{window}}',
  invalid_block_for: 'blockFor doit être une durée positive, reçu : {{blockFor}}',
  invalid_ban_for: 'banFor doit être une durée positive, reçu : {{banFor}}',
  empty_honeypot_paths: 'paths de la stratégie honeypot ne peut pas être vide',
  empty_http_error_status_codes:
    'statusCodes de la stratégie http-error ne peut pas être vide',
  empty_socket_events: 'events de la stratégie socket-events ne peut pas être vide',
  blocked: 'Accès refusé',
});
