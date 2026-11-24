import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub закрыты, трансляцыя немагчымая',
  resync_failed: 'Не ўдалося аднавіць падпіскі Redis',
  sync_room_failed: 'Не ўдалося выраўнаваць падпіску пакоя: {{room}}',
  bus_fanout_failed: 'Збой рассылкі па шыне',
  destroy_ready_failed: 'Пры спыненні не ўдалося дачакацца ініцыялізацыі Hub',
});
