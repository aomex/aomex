import { I18n } from '@aomex/common';

export const zh = I18n.define({
  unknown_user_abuse_reason: '未知的用户滥用原因：{{reason}}',
  unknown_ip_abuse_reason: '未知的 IP 滥用原因：{{reason}}',
  duplicate_user_abuse_reason: '重复的用户滥用原因：{{reason}}',
  duplicate_ip_abuse_reason: '重复的 IP 滥用原因：{{reason}}',
  missing_on_ban_user: '配置了 user-abuse 策略时必须提供 onBanUser',
  invalid_limit: 'limit 必须为正整数，收到：{{limit}}',
  invalid_window: 'window 必须为正数时长，收到：{{window}}',
  invalid_block_for: 'blockFor 必须为正数时长，收到：{{blockFor}}',
  invalid_ban_for: 'banFor 必须为正数时长，收到：{{banFor}}',
  empty_honeypot_paths: 'honeypot 策略的 paths 不能为空',
  empty_http_error_status_codes: 'http-error 策略的 statusCodes 不能为空',
});
