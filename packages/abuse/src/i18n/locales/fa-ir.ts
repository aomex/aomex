import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'دلیل سوءاستفاده کاربر ناشناخته: {{reason}}',
  unknown_ip_abuse_reason: 'دلیل سوءاستفاده IP ناشناخته: {{reason}}',
  duplicate_user_abuse_reason: 'دلیل سوءاستفاده کاربر تکراری: {{reason}}',
  duplicate_ip_abuse_reason: 'دلیل سوءاستفاده IP تکراری: {{reason}}',
  missing_on_ban_user: 'هنگام پیکربندی راهبردهای user-abuse باید onBanUser ارائه شود',
  invalid_limit: 'limit باید عدد صحیح مثبت باشد، دریافت‌شده: {{limit}}',
  invalid_window: 'window باید مدت مثبت باشد، دریافت‌شده: {{window}}',
  invalid_block_for: 'blockFor باید مدت مثبت باشد، دریافت‌شده: {{blockFor}}',
  invalid_ban_for: 'banFor باید مدت مثبت باشد، دریافت‌شده: {{banFor}}',
  empty_honeypot_paths: 'paths راهبرد honeypot نمی‌تواند خالی باشد',
  empty_http_error_status_codes: 'statusCodes راهبرد http-error نمی‌تواند خالی باشد',
  empty_socket_events: 'events راهبرد socket-events نمی‌تواند خالی باشد',
  blocked: 'دسترسی ممنوع',
});
