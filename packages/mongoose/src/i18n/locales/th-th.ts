import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ต้องเป็นประเภท Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} ต้องเป็นประเภท ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'ยังไม่รองรับ {{validator}}',
  },
  migration: {
    create: 'สร้างไฟล์การโยกย้าย',
    up: 'ดำเนินการโยกย้าย',
    down: 'การโยกย้ายย้อนกลับ',
    file_not_found: 'ไม่มีไฟล์การโยกย้าย "{{file}}"',
    input_file_name: 'โปรดป้อนชื่อไฟล์การโยกย้าย:',
    file_created: 'สร้างไฟล์การโยกย้ายสำเร็จแล้ว "{{file}}"',
  },
});
