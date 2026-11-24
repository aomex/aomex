import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-BR */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub está fechado, não é possível transmitir',
  resync_failed: 'Falha ao restaurar as assinaturas do Redis',
  sync_room_failed: 'Falha ao alinhar a assinatura da sala: {{room}}',
  bus_fanout_failed: 'Falha no fanout do barramento',
  destroy_ready_failed: 'Falha ao aguardar a inicialização do Hub no encerramento',
});
