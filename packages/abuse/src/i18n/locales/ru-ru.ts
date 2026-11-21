import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason:
    'Неизвестная причина злоупотребления пользователем: {{reason}}',
  unknown_ip_abuse_reason: 'Неизвестная причина злоупотребления IP: {{reason}}',
  duplicate_user_abuse_reason:
    'Повторяющаяся причина злоупотребления пользователем: {{reason}}',
  duplicate_ip_abuse_reason: 'Повторяющаяся причина злоупотребления IP: {{reason}}',
  missing_on_ban_user:
    'При настроенных стратегиях user-abuse необходимо указать onBanUser',
  invalid_limit: 'limit должен быть положительным целым числом, получено: {{limit}}',
  invalid_window: 'window должен быть положительной длительностью, получено: {{window}}',
  invalid_block_for:
    'blockFor должен быть положительной длительностью, получено: {{blockFor}}',
  invalid_ban_for: 'banFor должен быть положительной длительностью, получено: {{banFor}}',
  empty_honeypot_paths: 'paths стратегии honeypot не может быть пустым',
  empty_http_error_status_codes: 'statusCodes стратегии http-error не может быть пустым',
});
