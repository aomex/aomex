import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Unknown user abuse reason: {{reason}}',
  unknown_ip_abuse_reason: 'Unknown IP abuse reason: {{reason}}',
  duplicate_user_abuse_reason: 'Duplicate user abuse reason: {{reason}}',
  duplicate_ip_abuse_reason: 'Duplicate IP abuse reason: {{reason}}',
  missing_on_ban_user: 'onBanUser is required when user-abuse strategies are configured',
  invalid_limit: 'limit must be a positive integer, got: {{limit}}',
  invalid_window: 'window must be a positive duration, got: {{window}}',
  invalid_block_for: 'blockFor must be a positive duration, got: {{blockFor}}',
  invalid_ban_for: 'banFor must be a positive duration, got: {{banFor}}',
  empty_honeypot_paths: 'honeypot strategy paths must not be empty',
  empty_http_error_status_codes: 'http-error strategy statusCodes must not be empty',
  empty_socket_events: 'socket-events strategy events must not be empty',
  blocked: 'Access denied',
});
