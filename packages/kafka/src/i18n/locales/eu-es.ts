import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ezin da hutsik egon',
  empty_broker: 'brokers helbide huts bat du',
  empty_client_id: 'clientId ezin da hutsik egon',
  empty_group_id: 'groupId ezin da hutsik egon',
  empty_topic: 'Gaiaren izena ezin da hutsik egon',
  invalid_topic_name: 'Gai-izen baliogabea: {{topic}}',
  topic_name_too_long: 'Gaiaren izena luzeegia da: {{length}} > {{max}}',
  duplicate_topic: 'Gaia behin baino gehiagotan erregistratuta dago: {{topic}}',
  mixed_group_id: 'consume dei batek groupId bakarra izan dezake',
  empty_consumers: 'Ez da Kafka kontsumitzailerik aurkitu',
  already_consuming: 'Kontsumitzaile bat dagoeneko martxan dago',
  closed: 'Kafka konexioa itxita dago',
  message_too_large: 'Mezuaren tamainak muga gainditzen du: {{bytes}} > {{max}}',
  invalid_json: 'Mezua ez da JSON baliozkoa',
  empty_message: 'Mezuaren gorputza hutsik dago',
  encode_failed: 'Mezua ezin izan da JSON gisa kodetu',
  unknown_topic: 'Harpidetu gabeko gai bat jaso da: {{topic}}',
  invalid_offset: 'Mezu-offset baliogabea: {{offset}}',
  idempotent_requires_all_acks:
    'Ekoizle idempotentea gaituta dagoenean, acks -1 izan behar da',
  unsupported_sasl: 'Onartzen ez den SASL mekanismoa: {{mechanism}}',
  unsupported_tls: 'TLS aukera ezin zaio bezeroari pasatu: {{name}}',
  heartbeat_exceeds_session:
    'Taupada-tarteak saioaren denbora-muga baino txikiagoa izan behar du',
});
