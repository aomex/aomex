import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason:
    'Пайдаланушыны теріс пайдаланудың белгісіз себебі: {{reason}}',
  unknown_ip_abuse_reason: 'IP-ні теріс пайдаланудың белгісіз себебі: {{reason}}',
  duplicate_user_abuse_reason:
    'Пайдаланушыны теріс пайдаланудың қайталанатын себебі: {{reason}}',
  duplicate_ip_abuse_reason: 'IP-ні теріс пайдаланудың қайталанатын себебі: {{reason}}',
  missing_on_ban_user: 'user-abuse стратегиялары бапталғанда onBanUser міндетті',
  invalid_limit: 'limit оң бүтін сан болуы керек, алынғаны: {{limit}}',
  invalid_window: 'window оң ұзақтық болуы керек, алынғаны: {{window}}',
  invalid_block_for: 'blockFor оң ұзақтық болуы керек, алынғаны: {{blockFor}}',
  invalid_ban_for: 'banFor оң ұзақтық болуы керек, алынғаны: {{banFor}}',
  empty_honeypot_paths: 'honeypot стратегиясының paths бос болмауы керек',
  empty_http_error_status_codes:
    'http-error стратегиясының statusCodes бос болмауы керек',
});
