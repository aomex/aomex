import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'មូលហេតុនៃការប្រើប្រាស់ខុសរបស់អ្នកប្រើមិនស្គាល់៖ {{reason}}',
  unknown_ip_abuse_reason: 'មូលហេតុនៃការប្រើប្រាស់ខុស IP មិនស្គាល់៖ {{reason}}',
  duplicate_user_abuse_reason: 'មូលហេតុនៃការប្រើប្រាស់ខុសរបស់អ្នកប្រើស្ទួន៖ {{reason}}',
  duplicate_ip_abuse_reason: 'មូលហេតុនៃការប្រើប្រាស់ខុស IP ស្ទួន៖ {{reason}}',
  missing_on_ban_user: 'ត្រូវផ្តល់ onBanUser នៅពេលកំណត់យុទ្ធសាស្ត្រ user-abuse',
  invalid_limit: 'limit ត្រូវតែជាចំនួនគត់វិជ្ជមាន ទទួលបាន៖ {{limit}}',
  invalid_window: 'window ត្រូវតែជារយៈពេលវិជ្ជមាន ទទួលបាន៖ {{window}}',
  invalid_block_for: 'blockFor ត្រូវតែជារយៈពេលវិជ្ជមាន ទទួលបាន៖ {{blockFor}}',
  invalid_ban_for: 'banFor ត្រូវតែជារយៈពេលវិជ្ជមាន ទទួលបាន៖ {{banFor}}',
  empty_honeypot_paths: 'paths នៃយុទ្ធសាស្ត្រ honeypot មិនអាចទទេបានទេ',
  empty_http_error_status_codes: 'statusCodes នៃយុទ្ធសាស្ត្រ http-error មិនអាចទទេបានទេ',
  empty_socket_events: 'events នៃយុទ្ធសាស្ត្រ socket-events មិនអាចទទេបានទេ',
  blocked: 'ការចូលប្រើត្រូវបានបដិសេធ',
});
