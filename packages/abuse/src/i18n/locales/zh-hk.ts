import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: '未知的用戶濫用原因：{{reason}}',
  unknown_ip_abuse_reason: '未知的 IP 濫用原因：{{reason}}',
  duplicate_user_abuse_reason: '重複的用戶濫用原因：{{reason}}',
  duplicate_ip_abuse_reason: '重複的 IP 濫用原因：{{reason}}',
  missing_on_ban_user: '配置了 user-abuse 策略時必須提供 onBanUser',
  invalid_limit: 'limit 必須為正整數，收到：{{limit}}',
  invalid_window: 'window 必須為正數時長，收到：{{window}}',
  invalid_block_for: 'blockFor 必須為正數時長，收到：{{blockFor}}',
  invalid_ban_for: 'banFor 必須為正數時長，收到：{{banFor}}',
  empty_honeypot_paths: 'honeypot 策略的 paths 不能為空',
  empty_http_error_status_codes: 'http-error 策略的 statusCodes 不能為空',
});
