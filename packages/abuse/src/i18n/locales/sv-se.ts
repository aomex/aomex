import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Okänd orsak till användarmissbruk: {{reason}}',
  unknown_ip_abuse_reason: 'Okänd orsak till IP-missbruk: {{reason}}',
  duplicate_user_abuse_reason: 'Duplicerad orsak till användarmissbruk: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplicerad orsak till IP-missbruk: {{reason}}',
  missing_on_ban_user: 'onBanUser krävs när user-abuse-strategier är konfigurerade',
  invalid_limit: 'limit måste vara ett positivt heltal, mottaget: {{limit}}',
  invalid_window: 'window måste vara en positiv varaktighet, mottaget: {{window}}',
  invalid_block_for: 'blockFor måste vara en positiv varaktighet, mottaget: {{blockFor}}',
  invalid_ban_for: 'banFor måste vara en positiv varaktighet, mottaget: {{banFor}}',
  empty_honeypot_paths: 'paths för honeypot-strategin får inte vara tom',
  empty_http_error_status_codes: 'statusCodes för http-error-strategin får inte vara tom',
  empty_socket_events: 'events för socket-events-strategin får inte vara tom',
  blocked: 'Åtkomst nekad',
});
