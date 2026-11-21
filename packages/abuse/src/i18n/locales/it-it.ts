import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Motivo di abuso utente sconosciuto: {{reason}}',
  unknown_ip_abuse_reason: 'Motivo di abuso IP sconosciuto: {{reason}}',
  duplicate_user_abuse_reason: 'Motivo di abuso utente duplicato: {{reason}}',
  duplicate_ip_abuse_reason: 'Motivo di abuso IP duplicato: {{reason}}',
  missing_on_ban_user:
    'onBanUser è obbligatorio quando sono configurate strategie user-abuse',
  invalid_limit: 'limit deve essere un intero positivo, ricevuto: {{limit}}',
  invalid_window: 'window deve essere una durata positiva, ricevuto: {{window}}',
  invalid_block_for: 'blockFor deve essere una durata positiva, ricevuto: {{blockFor}}',
  invalid_ban_for: 'banFor deve essere una durata positiva, ricevuto: {{banFor}}',
  empty_honeypot_paths: 'paths della strategia honeypot non può essere vuoto',
  empty_http_error_status_codes:
    'statusCodes della strategia http-error non può essere vuoto',
});
