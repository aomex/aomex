import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'เมื่อ credentials เป็น true ต้องตั้งค่า origin อย่างชัดเจน (ต้นทางที่เจาะจง รายการอนุญาต หรือฟังก์ชันที่คืนต้นทางที่เจาะจง) ห้ามพึ่งการสะท้อนค่าเริ่มต้น',
  credentials_with_wildcard_origin:
    'เมื่อ credentials เป็น true จะตั้ง origin เป็น "*" ไม่ได้: เบราว์เซอร์ไม่ยอมรับชุดค่านี้ โปรดเปลี่ยนเป็นต้นทางที่เจาะจง รายการอนุญาต หรือฟังก์ชันที่คืนต้นทางที่เจาะจง',
});
