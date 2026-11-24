import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Geçersiz olay adı',
  invalid_room_name: 'Geçersiz oda adı',
  unknown_event: 'Bilinmeyen olay: {{event}}',
  handler_error: 'Olay işleme başarısız oldu',
  duplicate_event: 'Olay zaten kayıtlı: {{event}}',
  already_attached: 'WebsocketApp zaten attach, yeniden bağlamayın',
  transport_init_failed: 'WebSocket aktarımı başlatılamadı',
  handshake_failed: 'WebSocket el sıkışması başarısız oldu',
  accept_failed: 'Bağlantı kabul edilemedi',
  fanout_deliver_failed: 'Fanout sırasında {{failed}} bağlantı yazması başarısız oldu',
  inbound_task_failed: 'Gelen olay işlenemedi',
  error_frame_failed: 'Hata çerçevesi gönderilemedi',
  remove_client_failed: 'Bağlantı kaldırılamadı',
  close_connection_failed: 'Bağlantı kapatılamadı',
  metric_handler_failed: 'Metrik geri çağrısı başarısız oldu',
});
