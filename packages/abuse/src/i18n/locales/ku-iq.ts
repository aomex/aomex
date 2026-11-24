import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'هۆکاری خراپ بەکارهێنانی بەکارهێنەر نەناسراو: {{reason}}',
  unknown_ip_abuse_reason: 'هۆکاری خراپ بەکارهێنانی IP نەناسراو: {{reason}}',
  duplicate_user_abuse_reason: 'هۆکاری دووبارەی خراپ بەکارهێنانی بەکارهێنەر: {{reason}}',
  duplicate_ip_abuse_reason: 'هۆکاری دووبارەی خراپ بەکارهێنانی IP: {{reason}}',
  missing_on_ban_user: 'کاتێک ستراتیژییەکانی user-abuse ڕێکدەخرێن، onBanUser پێویستە',
  invalid_limit: 'limit دەبێت ژمارەی تەواوی ئەرێنی بێت، وەرگیراو: {{limit}}',
  invalid_window: 'window دەبێت ماوەی ئەرێنی بێت، وەرگیراو: {{window}}',
  invalid_block_for: 'blockFor دەبێت ماوەی ئەرێنی بێت، وەرگیراو: {{blockFor}}',
  invalid_ban_for: 'banFor دەبێت ماوەی ئەرێنی بێت، وەرگیراو: {{banFor}}',
  empty_honeypot_paths: 'paths ی ستراتیژی honeypot نابێت بەتاڵ بێت',
  empty_http_error_status_codes: 'statusCodes ی ستراتیژی http-error نابێت بەتاڵ بێت',
  empty_socket_events: 'events ی ستراتیژی socket-events نابێت بەتاڵ بێت',
  blocked: 'دەستگەیشتن ڕەتکرایەوە',
});
