import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  empty_brokers: "brokers bo'sh bo'lishi mumkin emas",
  empty_broker: "brokers bo'sh manzilni o'z ichiga oladi",
  empty_client_id: "clientId bo'sh bo'lishi mumkin emas",
  empty_group_id: "groupId bo'sh bo'lishi mumkin emas",
  empty_topic: "Mavzu nomi bo'sh bo'lishi mumkin emas",
  invalid_topic_name: "Noto'g'ri mavzu nomi: {{topic}}",
  topic_name_too_long: 'Mavzu nomi juda uzun: {{length}} > {{max}}',
  duplicate_topic: "Mavzu bir necha marta ro'yxatdan o'tgan: {{topic}}",
  mixed_group_id: "Bitta consume chaqiruvida faqat bitta groupId bo'lishi mumkin",
  empty_consumers: 'Kafka isteʼmolchilari topilmadi',
  already_consuming: 'Isteʼmolchi allaqachon ishlayapti',
  closed: 'Kafka ulanishi yopiq',
  message_too_large: 'Xabar hajmi chegaradan oshadi: {{bytes}} > {{max}}',
  invalid_json: 'Xabar yaroqli JSON emas',
  empty_message: "Xabar tanasi bo'sh",
  encode_failed: 'Xabarni JSON sifatida kodlab bo‘lmadi',
  unknown_topic: 'Obuna qilinmagan mavzu qabul qilindi: {{topic}}',
  invalid_offset: "Noto'g'ri xabar siljishi: {{offset}}",
  idempotent_requires_all_acks: "Idempotent producer yoqilganda acks -1 bo'lishi kerak",
  unsupported_sasl: "Qo'llab-quvvatlanmaydigan SASL mexanizmi: {{mechanism}}",
  unsupported_tls: 'TLS sozlamasini mijozga berib bo‘lmaydi: {{name}}',
  heartbeat_exceeds_session:
    "Yurak urishi oralig'i sessiya vaqtidan kichik bo'lishi kerak",
});
