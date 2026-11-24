import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'အသုံးပြုသူ အလွဲသုံးစားမှု အကြောင်းရင်း မသိရပါ: {{reason}}',
  unknown_ip_abuse_reason: 'IP အလွဲသုံးစားမှု အကြောင်းရင်း မသိရပါ: {{reason}}',
  duplicate_user_abuse_reason: 'အသုံးပြုသူ အလွဲသုံးစားမှု အကြောင်းရင်း ထပ်နေသည်: {{reason}}',
  duplicate_ip_abuse_reason: 'IP အလွဲသုံးစားမှု အကြောင်းရင်း ထပ်နေသည်: {{reason}}',
  missing_on_ban_user: 'user-abuse ဗျူဟာများ သတ်မှတ်ထားလျှင် onBanUser လိုအပ်သည်',
  invalid_limit: 'limit သည် အပေါင်းကိန်းပြည့်ဖြစ်ရမည်၊ ရရှိသည်: {{limit}}',
  invalid_window: 'window သည် အပေါင်းကြာချိန်ဖြစ်ရမည်၊ ရရှိသည်: {{window}}',
  invalid_block_for: 'blockFor သည် အပေါင်းကြာချိန်ဖြစ်ရမည်၊ ရရှိသည်: {{blockFor}}',
  invalid_ban_for: 'banFor သည် အပေါင်းကြာချိန်ဖြစ်ရမည်၊ ရရှိသည်: {{banFor}}',
  empty_honeypot_paths: 'honeypot ဗျူဟာ၏ paths သည် ဗလာမဖြစ်ရ',
  empty_http_error_status_codes: 'http-error ဗျူဟာ၏ statusCodes သည် ဗလာမဖြစ်ရ',
  empty_socket_events: 'socket-events ဗျူဟာ၏ events သည် ဗလာမဖြစ်ရ',
  blocked: 'ဝင်ရောက်ခွင့် ငြင်းပယ်ထားသည်',
});
