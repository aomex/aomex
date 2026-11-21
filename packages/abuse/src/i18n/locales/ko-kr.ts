import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: '알 수 없는 사용자 남용 사유: {{reason}}',
  unknown_ip_abuse_reason: '알 수 없는 IP 남용 사유: {{reason}}',
  duplicate_user_abuse_reason: '중복된 사용자 남용 사유: {{reason}}',
  duplicate_ip_abuse_reason: '중복된 IP 남용 사유: {{reason}}',
  missing_on_ban_user: 'user-abuse 전략을 구성할 때 onBanUser가 필요합니다',
  invalid_limit: 'limit은 양의 정수여야 합니다. 받은 값: {{limit}}',
  invalid_window: 'window는 양의 기간이어야 합니다. 받은 값: {{window}}',
  invalid_block_for: 'blockFor는 양의 기간이어야 합니다. 받은 값: {{blockFor}}',
  invalid_ban_for: 'banFor는 양의 기간이어야 합니다. 받은 값: {{banFor}}',
  empty_honeypot_paths: 'honeypot 전략의 paths는 비워둘 수 없습니다',
  empty_http_error_status_codes: 'http-error 전략의 statusCodes는 비워둘 수 없습니다',
});
