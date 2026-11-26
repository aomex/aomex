import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers boş ola bilməz',
  empty_broker: 'brokers boş ünvan ehtiva edir',
  empty_client_id: 'clientId boş ola bilməz',
  empty_group_id: 'groupId boş ola bilməz',
  empty_topic: 'Mövzu adı boş ola bilməz',
  invalid_topic_name: 'Yanlış mövzu adı: {{topic}}',
  topic_name_too_long: 'Mövzu adı çox uzundur: {{length}} > {{max}}',
  duplicate_topic: 'Mövzu təkrar qeydiyyatdan keçib: {{topic}}',
  mixed_group_id: 'Bir consume çağırışında yalnız bir groupId ola bilər',
  empty_consumers: 'Kafka istehlakçısı tapılmadı',
  already_consuming: 'İstehlakçı artıq işləyir',
  closed: 'Kafka bağlantısı bağlanıb',
  message_too_large: 'Mesaj ölçüsü limiti aşır: {{bytes}} > {{max}}',
  invalid_json: 'Mesaj etibarlı JSON deyil',
  empty_message: 'Mesaj gövdəsi boşdur',
  encode_failed: 'Mesaj JSON kimi kodlana bilmədi',
  unknown_topic: 'Abunə olunmamış mövzu alındı: {{topic}}',
  invalid_offset: 'Yanlış mesaj ofseti: {{offset}}',
  idempotent_requires_all_acks: 'İdempotent producer açıq olduqda acks -1 olmalıdır',
  unsupported_sasl: 'Dəstəklənməyən SASL mexanizmi: {{mechanism}}',
  unsupported_tls: 'TLS konfiqurasiyası müştəriyə ötürülə bilməz: {{name}}',
  heartbeat_exceeds_session:
    'Ürək döyüntüsü intervalı sessiya vaxt aşımından kiçik olmalıdır',
});
