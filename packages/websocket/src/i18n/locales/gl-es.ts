import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nome de evento non válido',
  invalid_room_name: 'Nome de sala non válido',
  unknown_event: 'Evento descoñecido: {{event}}',
  handler_error: 'Fallou o procesamento do evento',
  duplicate_event: 'Evento xa rexistrado: {{event}}',
  already_attached: 'WebsocketApp xa está attach, non o montes de novo',
  transport_init_failed: 'Non se puido inicializar o transporte WebSocket',
  handshake_failed: 'Fallou o saúdo WebSocket',
  accept_failed: 'Non se puido aceptar a conexión',
  fanout_deliver_failed: 'Fallou a escritura en {{failed}} conexións durante a difusión',
  inbound_task_failed: 'Fallou o procesamento do evento entrante',
  error_frame_failed: 'Non se puido enviar a trama de erro',
  remove_client_failed: 'Non se puido quitar a conexión',
  close_connection_failed: 'Non se puido pechar a conexión',
  metric_handler_failed: 'Fallou a devolución de métricas',
});
