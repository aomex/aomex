import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers må ikke være tom',
  empty_broker: 'brokers indeholder en tom adresse',
  empty_client_id: 'clientId må ikke være tom',
  empty_group_id: 'groupId må ikke være tom',
  empty_topic: 'Emnenavnet må ikke være tomt',
  invalid_topic_name: 'Ugyldigt emnenavn: {{topic}}',
  topic_name_too_long: 'Emnenavnet er for langt: {{length}} > {{max}}',
  duplicate_topic: 'Emnet er registreret mere end én gang: {{topic}}',
  mixed_group_id: 'Ét consume-kald må kun have ét groupId',
  empty_consumers: 'Ingen Kafka-consumers fundet',
  already_consuming: 'En consumer kører allerede',
  closed: 'Kafka-forbindelsen er lukket',
  message_too_large: 'Meddelelsesstørrelsen overskrider grænsen: {{bytes}} > {{max}}',
  invalid_json: 'Meddelelsen er ikke gyldig JSON',
  empty_message: 'Meddelelsens brødtekst er tom',
  encode_failed: 'Meddelelsen kunne ikke kodes som JSON',
  unknown_topic: 'Modtog et ikke-abonneret emne: {{topic}}',
  invalid_offset: 'Ugyldig meddelelses-offset: {{offset}}',
  idempotent_requires_all_acks:
    'Når den idempotente producer er aktiveret, skal acks være -1',
  unsupported_sasl: 'Ikke-understøttet SASL-mekanisme: {{mechanism}}',
  unsupported_tls: 'TLS-indstillingen kan ikke sendes til klienten: {{name}}',
  heartbeat_exceeds_session: 'Heartbeat-intervallet skal være mindre end session-timeout',
});
