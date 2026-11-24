import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Onbekende gebruikersmisbruikreden: {{reason}}',
  unknown_ip_abuse_reason: 'Onbekende IP-misbruikreden: {{reason}}',
  duplicate_user_abuse_reason: 'Dubbele gebruikersmisbruikreden: {{reason}}',
  duplicate_ip_abuse_reason: 'Dubbele IP-misbruikreden: {{reason}}',
  missing_on_ban_user:
    'onBanUser is vereist wanneer user-abuse-strategieën zijn geconfigureerd',
  invalid_limit: 'limit moet een positief geheel getal zijn, ontvangen: {{limit}}',
  invalid_window: 'window moet een positieve duur zijn, ontvangen: {{window}}',
  invalid_block_for: 'blockFor moet een positieve duur zijn, ontvangen: {{blockFor}}',
  invalid_ban_for: 'banFor moet een positieve duur zijn, ontvangen: {{banFor}}',
  empty_honeypot_paths: 'paths van honeypot-strategie mag niet leeg zijn',
  empty_http_error_status_codes:
    'statusCodes van http-error-strategie mag niet leeg zijn',
  empty_socket_events: 'events van socket-events-strategie mag niet leeg zijn',
  blocked: 'Toegang geweigerd',
});
