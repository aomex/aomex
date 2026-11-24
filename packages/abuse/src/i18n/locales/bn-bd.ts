import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'অজানা ব্যবহারকারী অপব্যবহারের কারণ: {{reason}}',
  unknown_ip_abuse_reason: 'অজানা IP অপব্যবহারের কারণ: {{reason}}',
  duplicate_user_abuse_reason: 'ডুপ্লিকেট ব্যবহারকারী অপব্যবহারের কারণ: {{reason}}',
  duplicate_ip_abuse_reason: 'ডুপ্লিকেট IP অপব্যবহারের কারণ: {{reason}}',
  missing_on_ban_user: 'user-abuse কৌশল কনফিগার করা থাকলে onBanUser আবশ্যক',
  invalid_limit: 'limit অবশ্যই ধনাত্মক পূর্ণসংখ্যা হতে হবে, প্রাপ্ত: {{limit}}',
  invalid_window: 'window অবশ্যই ধনাত্মক সময়কাল হতে হবে, প্রাপ্ত: {{window}}',
  invalid_block_for: 'blockFor অবশ্যই ধনাত্মক সময়কাল হতে হবে, প্রাপ্ত: {{blockFor}}',
  invalid_ban_for: 'banFor অবশ্যই ধনাত্মক সময়কাল হতে হবে, প্রাপ্ত: {{banFor}}',
  empty_honeypot_paths: 'honeypot কৌশলের paths খালি হতে পারে না',
  empty_http_error_status_codes: 'http-error কৌশলের statusCodes খালি হতে পারে না',
  empty_socket_events: 'socket-events কৌশলের events খালি হতে পারে না',
  blocked: 'প্রবেশাধিকার নিষিদ্ধ',
});
