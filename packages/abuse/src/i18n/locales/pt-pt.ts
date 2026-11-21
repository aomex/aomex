import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Motivo de abuso de utilizador desconhecido: {{reason}}',
  unknown_ip_abuse_reason: 'Motivo de abuso de IP desconhecido: {{reason}}',
  duplicate_user_abuse_reason: 'Motivo de abuso de utilizador duplicado: {{reason}}',
  duplicate_ip_abuse_reason: 'Motivo de abuso de IP duplicado: {{reason}}',
  missing_on_ban_user:
    'onBanUser é obrigatório quando estratégias user-abuse estão configuradas',
  invalid_limit: 'limit deve ser um inteiro positivo, recebido: {{limit}}',
  invalid_window: 'window deve ser uma duração positiva, recebido: {{window}}',
  invalid_block_for: 'blockFor deve ser uma duração positiva, recebido: {{blockFor}}',
  invalid_ban_for: 'banFor deve ser uma duração positiva, recebido: {{banFor}}',
  empty_honeypot_paths: 'paths da estratégia honeypot não pode estar vazio',
  empty_http_error_status_codes:
    'statusCodes da estratégia http-error não pode estar vazio',
});
