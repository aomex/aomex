import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Motivo de abuso de usuario desconocido: {{reason}}',
  unknown_ip_abuse_reason: 'Motivo de abuso de IP desconocido: {{reason}}',
  duplicate_user_abuse_reason: 'Motivo de abuso de usuario duplicado: {{reason}}',
  duplicate_ip_abuse_reason: 'Motivo de abuso de IP duplicado: {{reason}}',
  missing_on_ban_user:
    'onBanUser es obligatorio cuando hay estrategias user-abuse configuradas',
  invalid_limit: 'limit debe ser un entero positivo, recibido: {{limit}}',
  invalid_window: 'window debe ser una duración positiva, recibido: {{window}}',
  invalid_block_for: 'blockFor debe ser una duración positiva, recibido: {{blockFor}}',
  invalid_ban_for: 'banFor debe ser una duración positiva, recibido: {{banFor}}',
  empty_honeypot_paths: 'paths de la estrategia honeypot no puede estar vacío',
  empty_http_error_status_codes:
    'statusCodes de la estrategia http-error no puede estar vacío',
  empty_socket_events: 'events de la estrategia socket-events no puede estar vacío',
  blocked: 'Acceso denegado',
});
