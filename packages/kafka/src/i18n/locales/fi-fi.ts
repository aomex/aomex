import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ei saa olla tyhjä',
  empty_broker: 'brokers sisältää tyhjän osoitteen',
  empty_client_id: 'clientId ei saa olla tyhjä',
  empty_group_id: 'groupId ei saa olla tyhjä',
  empty_topic: 'Aiheen nimi ei saa olla tyhjä',
  invalid_topic_name: 'Virheellinen aiheen nimi: {{topic}}',
  topic_name_too_long: 'Aiheen nimi on liian pitkä: {{length}} > {{max}}',
  duplicate_topic: 'Aihe on rekisteröity useammin kuin kerran: {{topic}}',
  mixed_group_id: 'Yhdessä consume-kutsussa saa olla vain yksi groupId',
  empty_consumers: 'Kafka-kuluttajia ei löytynyt',
  already_consuming: 'Kuluttaja on jo käynnissä',
  closed: 'Kafka-yhteys on suljettu',
  message_too_large: 'Viestin koko ylittää rajan: {{bytes}} > {{max}}',
  invalid_json: 'Viesti ei ole kelvollista JSONia',
  empty_message: 'Viestin runko on tyhjä',
  encode_failed: 'Viestiä ei voitu koodata JSONiksi',
  unknown_topic: 'Vastaanotettiin tilaamaton aihe: {{topic}}',
  invalid_offset: 'Virheellinen viestin offset: {{offset}}',
  idempotent_requires_all_acks:
    'Kun idempotentti tuottaja on käytössä, acksin on oltava -1',
  unsupported_sasl: 'Ei tuettu SASL-mekanismi: {{mechanism}}',
  unsupported_tls: 'TLS-asetusta ei voida välittää asiakkaalle: {{name}}',
  heartbeat_exceeds_session:
    'Sydämenlyöntivälin on oltava pienempi kuin istunnon aikakatkaisu',
});
