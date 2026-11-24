import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Yaroqsiz hodisa nomi',
  invalid_room_name: 'Yaroqsiz xona nomi',
  unknown_event: 'Nomaʼlum hodisa: {{event}}',
  handler_error: 'Hodisani qayta ishlash muvaffaqiyatsiz tugadi',
  duplicate_event: 'Hodisa allaqachon roʻyxatdan oʻtgan: {{event}}',
  already_attached: 'WebsocketApp allaqachon attach qilingan, qayta ulamang',
  transport_init_failed: 'WebSocket uzatishini ishga tushirib bo‘lmadi',
  handshake_failed: 'WebSocket qo‘l siqish amalga oshmadi',
  accept_failed: 'Ulanishni qabul qilib bo‘lmadi',
  fanout_deliver_failed:
    'Tarqatish paytida {{failed}} ta ulanishga yozish amalga oshmadi',
  inbound_task_failed: 'Kiruvchi hodisani qayta ishlab bo‘lmadi',
  error_frame_failed: 'Xato kadri yuborilmadi',
  remove_client_failed: 'Ulanishni olib tashlab bo‘lmadi',
  close_connection_failed: 'Ulanishni yopib bo‘lmadi',
  metric_handler_failed: 'Metrika qayta chaqiruvida xatolik',
});
