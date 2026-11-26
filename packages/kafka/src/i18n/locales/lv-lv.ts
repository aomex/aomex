import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers nedrīkst būt tukšs',
  empty_broker: 'brokers satur tukšu adresi',
  empty_client_id: 'clientId nedrīkst būt tukšs',
  empty_group_id: 'groupId nedrīkst būt tukšs',
  empty_topic: 'Tēmas nosaukums nedrīkst būt tukšs',
  invalid_topic_name: 'Nederīgs tēmas nosaukums: {{topic}}',
  topic_name_too_long: 'Tēmas nosaukums ir pārāk garš: {{length}} > {{max}}',
  duplicate_topic: 'Tēma ir reģistrēta vairāk nekā vienu reizi: {{topic}}',
  mixed_group_id: 'Vienā consume izsaukumā var būt tikai viens groupId',
  empty_consumers: 'Kafka patērētāji nav atrasti',
  already_consuming: 'Patērētājs jau darbojas',
  closed: 'Kafka savienojums ir aizvērts',
  message_too_large: 'Ziņojuma izmērs pārsniedz limitu: {{bytes}} > {{max}}',
  invalid_json: 'Ziņojums nav derīgs JSON',
  empty_message: 'Ziņojuma saturs ir tukšs',
  encode_failed: 'Neizdevās kodēt ziņojumu kā JSON',
  unknown_topic: 'Saņemta neabonēta tēma: {{topic}}',
  invalid_offset: 'Nederīgs ziņojuma nobīde: {{offset}}',
  idempotent_requires_all_acks: 'Kad ir ieslēgts idempotents producer, acks jābūt -1',
  unsupported_sasl: 'Neatbalstīts SASL mehānisms: {{mechanism}}',
  unsupported_tls: 'TLS opciju nevar nodot klientam: {{name}}',
  heartbeat_exceeds_session: 'Sirdspukstu intervālam jābūt mazākam par sesijas noildzi',
});
