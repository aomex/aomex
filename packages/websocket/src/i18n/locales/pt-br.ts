import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nome de evento inválido',
  invalid_room_name: 'Nome de sala inválido',
  unknown_event: 'Evento desconhecido: {{event}}',
  handler_error: 'Falha ao processar o evento',
  duplicate_event: 'Evento já registrado: {{event}}',
  already_attached: 'WebsocketApp já está attach, não monte novamente',
  transport_init_failed: 'Falha ao inicializar o transporte WebSocket',
  handshake_failed: 'Falha no handshake WebSocket',
  accept_failed: 'Falha ao aceitar a conexão',
  fanout_deliver_failed: '{{failed}} gravações de conexão falharam durante o fanout',
  inbound_task_failed: 'Falha ao processar o evento de entrada',
  error_frame_failed: 'Falha ao enviar o quadro de erro',
  remove_client_failed: 'Falha ao remover a conexão',
  close_connection_failed: 'Falha ao fechar a conexão',
  metric_handler_failed: 'Falha no callback de métricas',
});
