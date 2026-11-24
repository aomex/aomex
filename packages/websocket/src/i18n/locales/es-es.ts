import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nombre de evento no válido',
  invalid_room_name: 'Nombre de sala no válido',
  unknown_event: 'Evento desconocido: {{event}}',
  handler_error: 'Error al procesar el evento',
  duplicate_event: 'Evento ya registrado: {{event}}',
  already_attached: 'WebsocketApp ya está attach, no lo montes de nuevo',
  transport_init_failed: 'Error al inicializar el transporte WebSocket',
  handshake_failed: 'Error en el handshake de WebSocket',
  accept_failed: 'Error al aceptar la conexión',
  fanout_deliver_failed: '{{failed}} escrituras de conexión fallaron durante la difusión',
  inbound_task_failed: 'Error al procesar el evento entrante',
  error_frame_failed: 'Error al enviar la trama de error',
  remove_client_failed: 'Error al quitar la conexión',
  close_connection_failed: 'Error al cerrar la conexión',
  metric_handler_failed: 'Error en la devolución de métricas',
});
