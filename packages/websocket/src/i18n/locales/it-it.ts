import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nome evento non valido',
  invalid_room_name: 'Nome stanza non valido',
  unknown_event: 'Evento sconosciuto: {{event}}',
  handler_error: "Elaborazione dell'evento non riuscita",
  duplicate_event: 'Evento già registrato: {{event}}',
  already_attached: 'WebsocketApp è già attach, non montarlo di nuovo',
  transport_init_failed: 'Inizializzazione del trasporto WebSocket non riuscita',
  handshake_failed: 'Handshake WebSocket non riuscito',
  accept_failed: 'Accettazione della connessione non riuscita',
  fanout_deliver_failed:
    '{{failed}} scritture di connessione non riuscite durante il fanout',
  inbound_task_failed: 'Elaborazione dell’evento in ingresso non riuscita',
  error_frame_failed: 'Invio del frame di errore non riuscito',
  remove_client_failed: 'Rimozione della connessione non riuscita',
  close_connection_failed: 'Chiusura della connessione non riuscita',
  metric_handler_failed: 'Callback delle metriche non riuscita',
});
