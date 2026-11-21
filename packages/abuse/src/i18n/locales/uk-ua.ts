import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Невідома причина зловживання користувачем: {{reason}}',
  unknown_ip_abuse_reason: 'Невідома причина зловживання IP: {{reason}}',
  duplicate_user_abuse_reason: 'Повторювана причина зловживання користувачем: {{reason}}',
  duplicate_ip_abuse_reason: 'Повторювана причина зловживання IP: {{reason}}',
  missing_on_ban_user:
    'Якщо налаштовано стратегії user-abuse, необхідно надати onBanUser',
  invalid_limit: 'limit має бути додатним цілим числом, отримано: {{limit}}',
  invalid_window: 'window має бути додатною тривалістю, отримано: {{window}}',
  invalid_block_for: 'blockFor має бути додатною тривалістю, отримано: {{blockFor}}',
  invalid_ban_for: 'banFor має бути додатною тривалістю, отримано: {{banFor}}',
  empty_honeypot_paths: 'paths стратегії honeypot не може бути порожнім',
  empty_http_error_status_codes: 'statusCodes стратегії http-error не може бути порожнім',
});
