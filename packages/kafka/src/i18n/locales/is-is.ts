import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers má ekki vera tómt',
  empty_broker: 'brokers inniheldur tómt vistfang',
  empty_client_id: 'clientId má ekki vera tómt',
  empty_group_id: 'groupId má ekki vera tómt',
  empty_topic: 'Heiti efnis má ekki vera tómt',
  invalid_topic_name: 'Ógilt heiti efnis: {{topic}}',
  topic_name_too_long: 'Heiti efnis er of langt: {{length}} > {{max}}',
  duplicate_topic: 'Efni er skráð oftar en einu sinni: {{topic}}',
  mixed_group_id: 'Eitt consume kall má aðeins hafa eitt groupId',
  empty_consumers: 'Engir Kafka neytendur fundust',
  already_consuming: 'Neytandi er þegar í gangi',
  closed: 'Kafka tenging er lokuð',
  message_too_large: 'Stærð skilaboða fer yfir mörk: {{bytes}} > {{max}}',
  invalid_json: 'Skilaboð eru ekki gilt JSON',
  empty_message: 'Meginmál skilaboða er tómt',
  encode_failed: 'Ekki tókst að kóða skilaboð sem JSON',
  unknown_topic: 'Óáskrifað efni barst: {{topic}}',
  invalid_offset: 'Ógilt hliðrun skilaboða: {{offset}}',
  idempotent_requires_all_acks:
    'Þegar idempotent producer er virkur verður acks að vera -1',
  unsupported_sasl: 'Óstuddur SASL búnaður: {{mechanism}}',
  unsupported_tls: 'Ekki er hægt að senda TLS stillingu til biðlara: {{name}}',
  heartbeat_exceeds_session: 'Hjartsláttarbil verður að vera minna en lotutími',
});
