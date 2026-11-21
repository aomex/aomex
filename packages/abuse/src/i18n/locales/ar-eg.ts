import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'سبب إساءة استخدام المستخدم غير معروف: {{reason}}',
  unknown_ip_abuse_reason: 'سبب إساءة استخدام IP غير معروف: {{reason}}',
  duplicate_user_abuse_reason: 'سبب إساءة استخدام المستخدم مكرر: {{reason}}',
  duplicate_ip_abuse_reason: 'سبب إساءة استخدام IP مكرر: {{reason}}',
  missing_on_ban_user: 'يجب توفير onBanUser عند تكوين استراتيجيات user-abuse',
  invalid_limit: 'يجب أن يكون limit عددًا صحيحًا موجبًا، المستلم: {{limit}}',
  invalid_window: 'يجب أن تكون window مدة موجبة، المستلم: {{window}}',
  invalid_block_for: 'يجب أن تكون blockFor مدة موجبة، المستلم: {{blockFor}}',
  invalid_ban_for: 'يجب أن تكون banFor مدة موجبة، المستلم: {{banFor}}',
  empty_honeypot_paths: 'لا يمكن أن تكون paths لاستراتيجية honeypot فارغة',
  empty_http_error_status_codes:
    'لا يمكن أن تكون statusCodes لاستراتيجية http-error فارغة',
});
