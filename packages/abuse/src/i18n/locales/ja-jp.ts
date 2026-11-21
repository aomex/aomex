import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: '未知のユーザー乱用理由：{{reason}}',
  unknown_ip_abuse_reason: '未知の IP 乱用理由：{{reason}}',
  duplicate_user_abuse_reason: '重複するユーザー乱用理由：{{reason}}',
  duplicate_ip_abuse_reason: '重複する IP 乱用理由：{{reason}}',
  missing_on_ban_user: 'user-abuse 戦略を設定した場合は onBanUser が必須です',
  invalid_limit: 'limit は正の整数である必要があります。受け取った値：{{limit}}',
  invalid_window: 'window は正の期間である必要があります。受け取った値：{{window}}',
  invalid_block_for:
    'blockFor は正の期間である必要があります。受け取った値：{{blockFor}}',
  invalid_ban_for: 'banFor は正の期間である必要があります。受け取った値：{{banFor}}',
  empty_honeypot_paths: 'honeypot 戦略の paths は空にできません',
  empty_http_error_status_codes: 'http-error 戦略の statusCodes は空にできません',
});
