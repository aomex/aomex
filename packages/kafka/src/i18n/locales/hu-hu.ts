import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  empty_brokers: 'A brokers nem lehet üres',
  empty_broker: 'A brokers üres címet tartalmaz',
  empty_client_id: 'A clientId nem lehet üres',
  empty_group_id: 'A groupId nem lehet üres',
  empty_topic: 'A téma neve nem lehet üres',
  invalid_topic_name: 'Érvénytelen témanév: {{topic}}',
  topic_name_too_long: 'A téma neve túl hosszú: {{length}} > {{max}}',
  duplicate_topic: 'A téma többször van regisztrálva: {{topic}}',
  mixed_group_id: 'Egy consume hívásban csak egy groupId lehet',
  empty_consumers: 'Nem találhatók Kafka fogyasztók',
  already_consuming: 'Már fut egy fogyasztó',
  closed: 'A Kafka kapcsolat le van zárva',
  message_too_large: 'Az üzenet mérete meghaladja a korlátot: {{bytes}} > {{max}}',
  invalid_json: 'Az üzenet nem érvényes JSON',
  empty_message: 'Az üzenettörzs üres',
  encode_failed: 'Az üzenetet nem lehet JSON-ként kódolni',
  unknown_topic: 'Nem feliratkozott téma érkezett: {{topic}}',
  invalid_offset: 'Érvénytelen üzeneteltolás: {{offset}}',
  idempotent_requires_all_acks:
    'Idempotens producer bekapcsolásakor az acks értéke -1 kell legyen',
  unsupported_sasl: 'Nem támogatott SASL mechanizmus: {{mechanism}}',
  unsupported_tls: 'A TLS beállítás nem adható át a kliensnek: {{name}}',
  heartbeat_exceeds_session:
    'A szívverés-intervallumnak kisebbnek kell lennie a munkamenet időtúllépésénél',
});
