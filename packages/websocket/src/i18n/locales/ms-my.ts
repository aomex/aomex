import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nama peristiwa tidak sah',
  invalid_room_name: 'Nama bilik tidak sah',
  unknown_event: 'Peristiwa tidak diketahui: {{event}}',
  handler_error: 'Pemprosesan peristiwa gagal',
  duplicate_event: 'Peristiwa sudah didaftarkan: {{event}}',
  already_attached: 'WebsocketApp sudah di-attach, jangan pasang semula',
  transport_init_failed: 'Gagal memulakan pengangkutan WebSocket',
  handshake_failed: 'Jabat tangan WebSocket gagal',
  accept_failed: 'Gagal menerima sambungan',
  fanout_deliver_failed: '{{failed}} penulisan sambungan gagal semasa fanout',
  inbound_task_failed: 'Gagal memproses peristiwa masuk',
  error_frame_failed: 'Gagal menghantar bingkai ralat',
  remove_client_failed: 'Gagal mengalih keluar sambungan',
  close_connection_failed: 'Gagal menutup sambungan',
  metric_handler_failed: 'Panggil balik metrik gagal',
});
