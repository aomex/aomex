import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers tidak boleh kosong',
  empty_broker: 'brokers berisi alamat kosong',
  empty_client_id: 'clientId tidak boleh kosong',
  empty_group_id: 'groupId tidak boleh kosong',
  empty_topic: 'Nama topik tidak boleh kosong',
  invalid_topic_name: 'Nama topik tidak valid: {{topic}}',
  topic_name_too_long: 'Nama topik terlalu panjang: {{length}} > {{max}}',
  duplicate_topic: 'Topik terdaftar lebih dari sekali: {{topic}}',
  mixed_group_id: 'Satu pemanggilan consume hanya boleh memiliki satu groupId',
  empty_consumers: 'Tidak ada konsumen Kafka yang ditemukan',
  already_consuming: 'Konsumen sudah berjalan',
  closed: 'Koneksi Kafka ditutup',
  message_too_large: 'Ukuran pesan melebihi batas: {{bytes}} > {{max}}',
  invalid_json: 'Pesan bukan JSON yang valid',
  empty_message: 'Badan pesan kosong',
  encode_failed: 'Pesan tidak dapat dikodekan sebagai JSON',
  unknown_topic: 'Menerima topik yang tidak dilanggan: {{topic}}',
  invalid_offset: 'Offset pesan tidak valid: {{offset}}',
  idempotent_requires_all_acks: 'Saat producer idempoten diaktifkan, acks harus -1',
  unsupported_sasl: 'Mekanisme SASL tidak didukung: {{mechanism}}',
  unsupported_tls: 'Opsi TLS tidak dapat diteruskan ke klien: {{name}}',
  heartbeat_exceeds_session:
    'Interval detak jantung harus lebih kecil dari batas waktu sesi',
});
