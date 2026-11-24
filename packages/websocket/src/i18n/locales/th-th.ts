import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'ชื่อเหตุการณ์ไม่ถูกต้อง',
  invalid_room_name: 'ชื่อห้องไม่ถูกต้อง',
  unknown_event: 'เหตุการณ์ที่ไม่รู้จัก: {{event}}',
  handler_error: 'การประมวลผลเหตุการณ์ล้มเหลว',
  duplicate_event: 'เหตุการณ์ถูกลงทะเบียนแล้ว: {{event}}',
  already_attached: 'WebsocketApp ถูก attach แล้ว อย่าติดตั้งซ้ำ',
  transport_init_failed: 'เริ่มต้นการส่ง WebSocket ไม่สำเร็จ',
  handshake_failed: 'การจับมือ WebSocket ไม่สำเร็จ',
  accept_failed: 'รับการเชื่อมต่อไม่สำเร็จ',
  fanout_deliver_failed: 'เขียนไปยัง {{failed}} การเชื่อมต่อไม่สำเร็จระหว่างการกระจาย',
  inbound_task_failed: 'ประมวลผลเหตุการณ์ขาเข้าไม่สำเร็จ',
  error_frame_failed: 'ส่งเฟรมข้อผิดพลาดไม่สำเร็จ',
  remove_client_failed: 'ลบการเชื่อมต่อไม่สำเร็จ',
  close_connection_failed: 'ปิดการเชื่อมต่อไม่สำเร็จ',
  metric_handler_failed: 'คอลแบ็กเมตริกล้มเหลว',
});
