import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ei tohi olla tühi',
  empty_broker: 'brokers sisaldab tühja aadressi',
  empty_client_id: 'clientId ei tohi olla tühi',
  empty_group_id: 'groupId ei tohi olla tühi',
  empty_topic: 'Teema nimi ei tohi olla tühi',
  invalid_topic_name: 'Kehtetu teema nimi: {{topic}}',
  topic_name_too_long: 'Teema nimi on liiga pikk: {{length}} > {{max}}',
  duplicate_topic: 'Teema on registreeritud rohkem kui üks kord: {{topic}}',
  mixed_group_id: 'Ühes consume kutses tohib olla ainult üks groupId',
  empty_consumers: 'Kafka tarbijaid ei leitud',
  already_consuming: 'Tarbija juba töötab',
  closed: 'Kafka ühendus on suletud',
  message_too_large: 'Sõnumi suurus ületab limiidi: {{bytes}} > {{max}}',
  invalid_json: 'Sõnum ei ole kehtiv JSON',
  empty_message: 'Sõnumi sisu on tühi',
  encode_failed: 'Sõnumit ei saanud JSON-iks kodeerida',
  unknown_topic: 'Vastu võeti tellimata teema: {{topic}}',
  invalid_offset: 'Kehtetu sõnumi nihe: {{offset}}',
  idempotent_requires_all_acks:
    'Idempotentse produtsendi sisselülitamisel peab acks olema -1',
  unsupported_sasl: 'Toetamata SASL mehhanism: {{mechanism}}',
  unsupported_tls: 'TLS sätet ei saa kliendile edastada: {{name}}',
  heartbeat_exceeds_session:
    'Südame löögisageduse intervall peab olema väiksem kui seansi ajalõpp',
});
