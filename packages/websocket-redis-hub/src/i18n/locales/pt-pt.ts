import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pt-PT */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub está fechado, não é possível difundir',
  resync_failed: 'Falha ao restaurar as subscrições Redis',
  sync_room_failed: 'Falha ao alinhar a subscrição da sala: {{room}}',
  bus_fanout_failed: 'Falha no fanout do barramento',
  destroy_ready_failed: 'Falha ao aguardar a inicialização do Hub no encerramento',
});
