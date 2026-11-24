import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'ไม่ทราบเหตุผลการใช้งานในทางที่ผิดของผู้ใช้: {{reason}}',
  unknown_ip_abuse_reason: 'ไม่ทราบเหตุผลการใช้งานในทางที่ผิดของ IP: {{reason}}',
  duplicate_user_abuse_reason: 'เหตุผลการใช้งานในทางที่ผิดของผู้ใช้ซ้ำ: {{reason}}',
  duplicate_ip_abuse_reason: 'เหตุผลการใช้งานในทางที่ผิดของ IP ซ้ำ: {{reason}}',
  missing_on_ban_user: 'ต้องระบุ onBanUser เมื่อกำหนดกลยุทธ์ user-abuse',
  invalid_limit: 'limit ต้องเป็นจำนวนเต็มบวก ที่ได้รับ: {{limit}}',
  invalid_window: 'window ต้องเป็นระยะเวลาที่เป็นบวก ที่ได้รับ: {{window}}',
  invalid_block_for: 'blockFor ต้องเป็นระยะเวลาที่เป็นบวก ที่ได้รับ: {{blockFor}}',
  invalid_ban_for: 'banFor ต้องเป็นระยะเวลาที่เป็นบวก ที่ได้รับ: {{banFor}}',
  empty_honeypot_paths: 'paths ของกลยุทธ์ honeypot ต้องไม่ว่าง',
  empty_http_error_status_codes: 'statusCodes ของกลยุทธ์ http-error ต้องไม่ว่าง',
  empty_socket_events: 'events ของกลยุทธ์ socket-events ต้องไม่ว่าง',
  blocked: 'ปฏิเสธการเข้าถึง',
});
