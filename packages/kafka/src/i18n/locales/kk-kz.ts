import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers бос болмауы керек',
  empty_broker: 'brokers бос мекенжайды қамтиды',
  empty_client_id: 'clientId бос болмауы керек',
  empty_group_id: 'groupId бос болмауы керек',
  empty_topic: 'Тақырып атауы бос болмауы керек',
  invalid_topic_name: 'Жарамсыз тақырып атауы: {{topic}}',
  topic_name_too_long: 'Тақырып атауы тым ұзын: {{length}} > {{max}}',
  duplicate_topic: 'Тақырып бірнеше рет тіркелген: {{topic}}',
  mixed_group_id: 'Бір consume шақыруында тек бір groupId болуы керек',
  empty_consumers: 'Kafka тұтынушылары табылмады',
  already_consuming: 'Тұтынушы қазірдің өзінде жұмыс істеп тұр',
  closed: 'Kafka қосылымы жабық',
  message_too_large: 'Хабарлама өлшемі шектен асады: {{bytes}} > {{max}}',
  invalid_json: 'Хабарлама жарамды JSON емес',
  empty_message: 'Хабарлама денесі бос',
  encode_failed: 'Хабарламаны JSON ретінде кодтау мүмкін болмады',
  unknown_topic: 'Жазылмаған тақырып алынды: {{topic}}',
  invalid_offset: 'Жарамсыз хабарлама ығысуы: {{offset}}',
  idempotent_requires_all_acks: 'Идемпотентті продюсер қосылғанда acks -1 болуы керек',
  unsupported_sasl: 'Қолдау көрсетілмейтін SASL механизмі: {{mechanism}}',
  unsupported_tls: 'TLS параметрін клиентке беру мүмкін емес: {{name}}',
  heartbeat_exceeds_session: 'Жүрек соғысы аралығы сеанс күту уақытынан кіші болуы керек',
});
