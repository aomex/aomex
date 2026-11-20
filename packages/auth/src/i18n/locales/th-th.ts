import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-th */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'ไม่สามารถสร้างเซสชันได้: ความพยายามในการเขียนหลายครั้งล้มเหลว โปรดตรวจสอบอะแดปเตอร์ที่เก็บข้อมูล',
  session_max_age_invalid: 'cookie.maxAge ต้องเป็นจำนวนบวก (หน่วยเป็นวินาที)',
});
