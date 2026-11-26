import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ცარიელი არ უნდა იყოს',
  empty_broker: 'brokers შეიცავს ცარიელ მისამართს',
  empty_client_id: 'clientId ცარიელი არ უნდა იყოს',
  empty_group_id: 'groupId ცარიელი არ უნდა იყოს',
  empty_topic: 'თემის სახელი ცარიელი არ უნდა იყოს',
  invalid_topic_name: 'არასწორი თემის სახელი: {{topic}}',
  topic_name_too_long: 'თემის სახელი ძალიან გრძელია: {{length}} > {{max}}',
  duplicate_topic: 'თემა რეგისტრირებულია ერთზე მეტჯერ: {{topic}}',
  mixed_group_id: 'ერთ consume გამოძახებაში მხოლოდ ერთი groupId შეიძლება იყოს',
  empty_consumers: 'Kafka მომხმარებლები ვერ მოიძებნა',
  already_consuming: 'მომხმარებელი უკვე მუშაობს',
  closed: 'Kafka კავშირი დახურულია',
  message_too_large: 'შეტყობინების ზომა აღემატება ლიმიტს: {{bytes}} > {{max}}',
  invalid_json: 'შეტყობინება არ არის ვალიდური JSON',
  empty_message: 'შეტყობინების ტანი ცარიელია',
  encode_failed: 'შეტყობინების JSON-ად კოდირება ვერ მოხერხდა',
  unknown_topic: 'მიღებულია გამოუწერელი თემა: {{topic}}',
  invalid_offset: 'არასწორი შეტყობინების ოფსეტი: {{offset}}',
  idempotent_requires_all_acks: 'იდემპოტენტური პროდიუსერის ჩართვისას acks უნდა იყოს -1',
  unsupported_sasl: 'მხარდაუჭერელი SASL მექანიზმი: {{mechanism}}',
  unsupported_tls: 'TLS პარამეტრის კლიენტზე გადაცემა შეუძლებელია: {{name}}',
  heartbeat_exceeds_session: 'გულისცემის ინტერვალი სესიის ვადაზე ნაკლები უნდა იყოს',
});
