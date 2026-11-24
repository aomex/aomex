import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  invalid_event_name: "Nom d'événement invalide",
  invalid_room_name: 'Nom de salle invalide',
  unknown_event: 'Événement inconnu : {{event}}',
  handler_error: "Échec du traitement de l'événement",
  duplicate_event: 'Événement déjà enregistré : {{event}}',
  already_attached: 'WebsocketApp est déjà attach, ne le montez pas à nouveau',
  transport_init_failed: 'Échec de l’initialisation du transport WebSocket',
  handshake_failed: 'Échec de la poignée de main WebSocket',
  accept_failed: 'Échec de l’acceptation de la connexion',
  fanout_deliver_failed:
    '{{failed}} écritures de connexion ont échoué pendant la diffusion',
  inbound_task_failed: 'Échec du traitement de l’événement entrant',
  error_frame_failed: 'Échec de l’envoi de la trame d’erreur',
  remove_client_failed: 'Échec du retrait de la connexion',
  close_connection_failed: 'Échec de la fermeture de la connexion',
  metric_handler_failed: 'Échec du rappel de métriques',
});
