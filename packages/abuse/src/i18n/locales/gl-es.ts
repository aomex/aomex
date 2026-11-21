import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Motivo de abuso de usuario descoñecido: {{reason}}',
  unknown_ip_abuse_reason: 'Motivo de abuso de IP descoñecido: {{reason}}',
  duplicate_user_abuse_reason: 'Motivo de abuso de usuario duplicado: {{reason}}',
  duplicate_ip_abuse_reason: 'Motivo de abuso de IP duplicado: {{reason}}',
  missing_on_ban_user:
    'onBanUser é obrigatorio cando hai estratexias user-abuse configuradas',
  invalid_limit: 'limit debe ser un enteiro positivo, recibido: {{limit}}',
  invalid_window: 'window debe ser unha duración positiva, recibido: {{window}}',
  invalid_block_for: 'blockFor debe ser unha duración positiva, recibido: {{blockFor}}',
  invalid_ban_for: 'banFor debe ser unha duración positiva, recibido: {{banFor}}',
  empty_honeypot_paths: 'paths da estratexia honeypot non pode estar baleiro',
  empty_http_error_status_codes:
    'statusCodes da estratexia http-error non pode estar baleiro',
});
