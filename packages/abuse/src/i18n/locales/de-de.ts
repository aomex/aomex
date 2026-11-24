import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Unbekannter Benutzer-Missbrauchsgrund: {{reason}}',
  unknown_ip_abuse_reason: 'Unbekannter IP-Missbrauchsgrund: {{reason}}',
  duplicate_user_abuse_reason: 'Doppelter Benutzer-Missbrauchsgrund: {{reason}}',
  duplicate_ip_abuse_reason: 'Doppelter IP-Missbrauchsgrund: {{reason}}',
  missing_on_ban_user:
    'Bei konfigurierten user-abuse-Strategien ist onBanUser erforderlich',
  invalid_limit: 'limit muss eine positive Ganzzahl sein, erhalten: {{limit}}',
  invalid_window: 'window muss eine positive Dauer sein, erhalten: {{window}}',
  invalid_block_for: 'blockFor muss eine positive Dauer sein, erhalten: {{blockFor}}',
  invalid_ban_for: 'banFor muss eine positive Dauer sein, erhalten: {{banFor}}',
  empty_honeypot_paths: 'paths der honeypot-Strategie darf nicht leer sein',
  empty_http_error_status_codes:
    'statusCodes der http-error-Strategie darf nicht leer sein',
  empty_socket_events: 'events der socket-events-Strategie darf nicht leer sein',
  blocked: 'Zugriff verweigert',
});
