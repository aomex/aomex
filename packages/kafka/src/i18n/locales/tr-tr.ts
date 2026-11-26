import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers boş olamaz',
  empty_broker: 'brokers boş bir adres içeriyor',
  empty_client_id: 'clientId boş olamaz',
  empty_group_id: 'groupId boş olamaz',
  empty_topic: 'Konu adı boş olamaz',
  invalid_topic_name: 'Geçersiz konu adı: {{topic}}',
  topic_name_too_long: 'Konu adı çok uzun: {{length}} > {{max}}',
  duplicate_topic: 'Konu birden fazla kez kaydedilmiş: {{topic}}',
  mixed_group_id: 'Bir consume çağrısında yalnızca bir groupId olabilir',
  empty_consumers: 'Kafka tüketicisi bulunamadı',
  already_consuming: 'Bir tüketici zaten çalışıyor',
  closed: 'Kafka bağlantısı kapalı',
  message_too_large: 'Mesaj boyutu sınırı aşıyor: {{bytes}} > {{max}}',
  invalid_json: 'Mesaj geçerli bir JSON değil',
  empty_message: 'Mesaj gövdesi boş',
  encode_failed: 'Mesaj JSON olarak kodlanamadı',
  unknown_topic: 'Abone olunmamış konu alındı: {{topic}}',
  invalid_offset: 'Geçersiz mesaj ofseti: {{offset}}',
  idempotent_requires_all_acks: 'Idempotent producer açıkken acks -1 olmalıdır',
  unsupported_sasl: 'Desteklenmeyen SASL mekanizması: {{mechanism}}',
  unsupported_tls: 'TLS seçeneği istemciye aktarılamaz: {{name}}',
  heartbeat_exceeds_session: 'Kalp atışı aralığı oturum zaman aşımından küçük olmalıdır',
});
