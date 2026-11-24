import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nama peristiwa tidak valid',
  invalid_room_name: 'Nama ruangan tidak valid',
  unknown_event: 'Peristiwa tidak dikenal: {{event}}',
  handler_error: 'Pemrosesan peristiwa gagal',
  duplicate_event: 'Peristiwa sudah terdaftar: {{event}}',
  already_attached: 'WebsocketApp sudah di-attach, jangan pasang ulang',
  transport_init_failed: 'Gagal menginisialisasi transport WebSocket',
  handshake_failed: 'Jabat tangan WebSocket gagal',
  accept_failed: 'Gagal menerima koneksi',
  fanout_deliver_failed: '{{failed}} penulisan koneksi gagal saat fanout',
  inbound_task_failed: 'Gagal memproses peristiwa masuk',
  error_frame_failed: 'Gagal mengirim bingkai kesalahan',
  remove_client_failed: 'Gagal menghapus koneksi',
  close_connection_failed: 'Gagal menutup koneksi',
  metric_handler_failed: 'Callback metrik gagal',
});
