import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  eject: 'ส่งออกรายการงานที่กำหนดเวลาไว้',
  start: 'เริ่มงานที่กำหนดเวลาไว้',
  stop: 'หยุดงานที่กำหนดเวลาไว้',
  stats: 'ตรวจสอบสถานะการดำเนินการของงานที่กำหนดเวลาไว้',
  not_started: 'งานที่กำหนดเวลาไว้ไม่ได้เริ่มต้น พอร์ต: {{port}}',
  invalid_cron_time: 'นิพจน์ cron ไม่ถูกต้อง: {{time}}',
  invalid_port: 'พอร์ตเซิร์ฟเวอร์ไม่ถูกต้อง: {{port}} (ช่วงที่ถูกต้อง: 1-65535)',
});
