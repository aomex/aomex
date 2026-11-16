import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  command_not_found: 'ไม่มีคำสั่ง "{{command}}"',
  command_found_recommended: 'ไม่มีคำสั่ง "{{command}}" คุณหมายถึง "aomex {{recommended}}"?',
  help: {
    command: '[คำสั่ง]',
    option: '[ตัวเลือก]',
    version: 'แสดงหมายเลขเวอร์ชั่นของ {{scriptName}}',
    no_usage: 'ไม่พบการใช้คำสั่ง "{{command}}"',
  },
});
