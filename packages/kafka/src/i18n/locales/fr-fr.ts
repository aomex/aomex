import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ne peut pas être vide',
  empty_broker: 'brokers contient une adresse vide',
  empty_client_id: 'clientId ne peut pas être vide',
  empty_group_id: 'groupId ne peut pas être vide',
  empty_topic: 'Le nom du sujet ne peut pas être vide',
  invalid_topic_name: 'Nom de sujet invalide : {{topic}}',
  topic_name_too_long: 'Le nom du sujet est trop long : {{length}} > {{max}}',
  duplicate_topic: 'Le sujet est enregistré plus d’une fois : {{topic}}',
  mixed_group_id: 'Un appel consume ne peut avoir qu’un seul groupId',
  empty_consumers: 'Aucun consommateur Kafka trouvé',
  already_consuming: 'Un consommateur est déjà en cours d’exécution',
  closed: 'La connexion Kafka est fermée',
  message_too_large: 'La taille du message dépasse la limite : {{bytes}} > {{max}}',
  invalid_json: 'Le message n’est pas un JSON valide',
  empty_message: 'Le corps du message est vide',
  encode_failed: 'Impossible d’encoder le message en JSON',
  unknown_topic: 'Sujet non abonné reçu : {{topic}}',
  invalid_offset: 'Décalage de message invalide : {{offset}}',
  idempotent_requires_all_acks:
    'Lorsque le producteur idempotent est activé, acks doit être -1',
  unsupported_sasl: 'Mécanisme SASL non pris en charge : {{mechanism}}',
  unsupported_tls: 'L’option TLS ne peut pas être transmise au client : {{name}}',
  heartbeat_exceeds_session:
    'L’intervalle de battement doit être inférieur au délai d’expiration de la session',
});
