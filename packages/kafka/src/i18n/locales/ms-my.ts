import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers tidak boleh kosong',
  empty_broker: 'brokers mengandungi alamat kosong',
  empty_client_id: 'clientId tidak boleh kosong',
  empty_group_id: 'groupId tidak boleh kosong',
  empty_topic: 'Nama topik tidak boleh kosong',
  invalid_topic_name: 'Nama topik tidak sah: {{topic}}',
  topic_name_too_long: 'Nama topik terlalu panjang: {{length}} > {{max}}',
  duplicate_topic: 'Topik didaftarkan lebih daripada sekali: {{topic}}',
  mixed_group_id: 'Satu panggilan consume hanya boleh mempunyai satu groupId',
  empty_consumers: 'Tiada pengguna Kafka dijumpai',
  already_consuming: 'Pengguna sudah berjalan',
  closed: 'Sambungan Kafka ditutup',
  message_too_large: 'Saiz mesej melebihi had: {{bytes}} > {{max}}',
  invalid_json: 'Mesej bukan JSON yang sah',
  empty_message: 'Badan mesej kosong',
  encode_failed: 'Mesej tidak dapat dikodkan sebagai JSON',
  unknown_topic: 'Topik yang tidak dilanggan diterima: {{topic}}',
  invalid_offset: 'Ofset mesej tidak sah: {{offset}}',
  idempotent_requires_all_acks: 'Apabila producer idempotent diaktifkan, acks mesti -1',
  unsupported_sasl: 'Mekanisme SASL tidak disokong: {{mechanism}}',
  unsupported_tls: 'Pilihan TLS tidak dapat dihantar kepada klien: {{name}}',
  heartbeat_exceeds_session:
    'Selang denyutan jantung mestilah lebih kecil daripada tamat masa sesi',
});
