import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  initialize: 'เอกสารการเริ่มต้น',
  search_routers_files: 'ค้นหาไฟล์เส้นทาง',
  parse_routers: 'แยกเส้นทาง',
  add_tag: 'เพิ่มแท็ก',
  hand_fix_documentation: 'ซ่อมแซมเอกสารด้วยตนเอง',
  optimize_parameter: 'พารามิเตอร์การเพิ่มประสิทธิภาพ',
  save_to_file: 'บันทึกเป็นไฟล์',
  validate: 'ตรวจสอบเอกสาร',
  help_summary: 'เครื่องมือสร้างเอกสาร OpenAPI v3',
  help_app_listen_tip:
    'แยก new WebApp ออกจาก app.listen (หรือ listen เฉพาะในไฟล์ทางเข้า) เพื่อไม่ให้การ import ของ CLI สตาร์ทเซิร์ฟเวอร์เป็นผลข้างเคียง',
  has_error: 'ข้อผิดพลาด {{error_count}} คำเตือน {{warning_count}}',
  no_error: 'ไม่มีข้อผิดพลาด',
});
