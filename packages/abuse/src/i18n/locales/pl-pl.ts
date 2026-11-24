import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Nieznany powód nadużycia użytkownika: {{reason}}',
  unknown_ip_abuse_reason: 'Nieznany powód nadużycia IP: {{reason}}',
  duplicate_user_abuse_reason: 'Zduplikowany powód nadużycia użytkownika: {{reason}}',
  duplicate_ip_abuse_reason: 'Zduplikowany powód nadużycia IP: {{reason}}',
  missing_on_ban_user: 'onBanUser jest wymagany, gdy skonfigurowano strategie user-abuse',
  invalid_limit: 'limit musi być dodatnią liczbą całkowitą, otrzymano: {{limit}}',
  invalid_window: 'window musi być dodatnim czasem trwania, otrzymano: {{window}}',
  invalid_block_for: 'blockFor musi być dodatnim czasem trwania, otrzymano: {{blockFor}}',
  invalid_ban_for: 'banFor musi być dodatnim czasem trwania, otrzymano: {{banFor}}',
  empty_honeypot_paths: 'paths strategii honeypot nie może być puste',
  empty_http_error_status_codes: 'statusCodes strategii http-error nie może być puste',
  empty_socket_events: 'events strategii socket-events nie może być puste',
  blocked: 'Odmowa dostępu',
});
