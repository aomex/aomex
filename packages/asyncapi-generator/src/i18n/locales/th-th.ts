import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  initialize: 'เอกสารการเริ่มต้น',
  search_channels_files: 'ค้นหาไฟล์ Channel',
  parse_channels: 'แยกวิเคราะห์ Channel',
  hand_fix_documentation: 'ซ่อมแซมเอกสารด้วยตนเอง',
  save_to_file: 'บันทึกเป็นไฟล์',
  validate: 'ตรวจสอบเอกสาร',
  help_summary: 'ตัวสร้างเอกสาร AsyncAPI 3',
  has_error: 'ข้อผิดพลาด {{error_count}} คำเตือน {{warning_count}}',
  no_error: 'ไม่มีข้อผิดพลาด',
});
