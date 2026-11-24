import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Yanlış hadisə adı',
  invalid_room_name: 'Yanlış otaq adı',
  unknown_event: 'Naməlum hadisə: {{event}}',
  handler_error: 'Hadisənin emalı uğursuz oldu',
  duplicate_event: 'Hadisə artıq qeydiyyatdadır: {{event}}',
  already_attached: 'WebsocketApp artıq attach edilib, təkrar qoşmayın',
  transport_init_failed: 'WebSocket nəqliyyatı işə salınmadı',
  handshake_failed: 'WebSocket əl sıxması alınmadı',
  accept_failed: 'Bağlantı qəbul edilmədi',
  fanout_deliver_failed: 'Yayım zamanı {{failed}} bağlantıya yazı alınmadı',
  inbound_task_failed: 'Gələn hadisə emal edilmədi',
  error_frame_failed: 'Xəta kadrı göndərilmədi',
  remove_client_failed: 'Bağlantı silinmədi',
  close_connection_failed: 'Bağlantı bağlanmadı',
  metric_handler_failed: 'Metrik geri çağırışı alınmadı',
});
