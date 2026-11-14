import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ต้องเป็นไฟล์',
      too_large: '{{label}} ไฟล์มีขนาดใหญ่เกินไป',
      unsupported_mimetype: 'ไม่รองรับประเภทไฟล์ {{label}}',
    },
  },
  response: {
    redirect: 'กำลังเปลี่ยนเส้นทางไปยัง {{url}}',
  },
});
