import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'صارف کے غلط استعمال کی نامعلوم وجہ: {{reason}}',
  unknown_ip_abuse_reason: 'IP کے غلط استعمال کی نامعلوم وجہ: {{reason}}',
  duplicate_user_abuse_reason: 'صارف کے غلط استعمال کی دہرائی ہوئی وجہ: {{reason}}',
  duplicate_ip_abuse_reason: 'IP کے غلط استعمال کی دہرائی ہوئی وجہ: {{reason}}',
  missing_on_ban_user: 'user-abuse حکمت عملیاں ترتیب دیتے وقت onBanUser لازمی ہے',
  invalid_limit: 'limit مثبت عدد صحیح ہونا چاہیے، موصول: {{limit}}',
  invalid_window: 'window مثبت مدت ہونی چاہیے، موصول: {{window}}',
  invalid_block_for: 'blockFor مثبت مدت ہونی چاہیے، موصول: {{blockFor}}',
  invalid_ban_for: 'banFor مثبت مدت ہونی چاہیے، موصول: {{banFor}}',
  empty_honeypot_paths: 'honeypot حکمت عملی کا paths خالی نہیں ہو سکتا',
  empty_http_error_status_codes: 'http-error حکمت عملی کا statusCodes خالی نہیں ہو سکتا',
});
