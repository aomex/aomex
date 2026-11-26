import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ต้องไม่ว่าง',
  empty_broker: 'brokers มีที่อยู่ว่าง',
  empty_client_id: 'clientId ต้องไม่ว่าง',
  empty_group_id: 'groupId ต้องไม่ว่าง',
  empty_topic: 'ชื่อหัวข้อต้องไม่ว่าง',
  invalid_topic_name: 'ชื่อหัวข้อไม่ถูกต้อง: {{topic}}',
  topic_name_too_long: 'ชื่อหัวข้อยาวเกินไป: {{length}} > {{max}}',
  duplicate_topic: 'หัวข้อถูกลงทะเบียนมากกว่าหนึ่งครั้ง: {{topic}}',
  mixed_group_id: 'การเรียก consume หนึ่งครั้งมีได้เพียงหนึ่ง groupId',
  empty_consumers: 'ไม่พบผู้บริโภค Kafka',
  already_consuming: 'มีผู้บริโภคกำลังทำงานอยู่แล้ว',
  closed: 'การเชื่อมต่อ Kafka ถูกปิดแล้ว',
  message_too_large: 'ขนาดข้อความเกินขีดจำกัด: {{bytes}} > {{max}}',
  invalid_json: 'ข้อความไม่ใช่ JSON ที่ถูกต้อง',
  empty_message: 'เนื้อหาข้อความว่างเปล่า',
  encode_failed: 'ไม่สามารถเข้ารหัสข้อความเป็น JSON ได้',
  unknown_topic: 'ได้รับหัวข้อที่ไม่ได้สมัคร: {{topic}}',
  invalid_offset: 'ออฟเซ็ตข้อความไม่ถูกต้อง: {{offset}}',
  idempotent_requires_all_acks: 'เมื่อเปิด producer แบบ idempotent แล้ว acks ต้องเป็น -1',
  unsupported_sasl: 'กลไก SASL ที่ไม่รองรับ: {{mechanism}}',
  unsupported_tls: 'ไม่สามารถส่งตัวเลือก TLS ให้ไคลเอนต์ได้: {{name}}',
  heartbeat_exceeds_session: 'ช่วงเวลาหัวใจเต้นต้องน้อยกว่าหมดเวลาเซสชัน',
});
