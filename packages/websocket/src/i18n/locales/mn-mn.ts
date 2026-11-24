import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Буруу үйл явдлын нэр',
  invalid_room_name: 'Буруу өрөөний нэр',
  unknown_event: 'Үл мэдэгдэх үйл явдал: {{event}}',
  handler_error: 'Үйл явдлыг боловсруулж чадсангүй',
  duplicate_event: 'Үйл явдал аль хэдийн бүртгэгдсэн: {{event}}',
  already_attached: 'WebsocketApp аль хэдийн attach хийгдсэн, дахин бүү холбо',
  transport_init_failed: 'WebSocket дамжуулалтыг эхлүүлж чадсангүй',
  handshake_failed: 'WebSocket гар барилт амжилтгүй',
  accept_failed: 'Холболтыг хүлээн авч чадсангүй',
  fanout_deliver_failed: 'Тархаах үед {{failed}} холболт руу бичих амжилтгүй',
  inbound_task_failed: 'Орох үйл явдлыг боловсруулж чадсангүй',
  error_frame_failed: 'Алдааны фреймийг илгээж чадсангүй',
  remove_client_failed: 'Холболтыг хасаж чадсангүй',
  close_connection_failed: 'Холболтыг хааж чадсангүй',
  metric_handler_failed: 'Хэмжүүрийн буцаалт амжилтгүй',
});
