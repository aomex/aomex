import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub jest zamknięty, nie można rozgłaszać',
  resync_failed: 'Nie udało się przywrócić subskrypcji Redis',
  sync_room_failed: 'Nie udało się wyrównać subskrypcji pokoju: {{room}}',
  bus_fanout_failed: 'Rozsyłanie magistralą nie powiodło się',
  destroy_ready_failed: 'Podczas zamykania nie udało się doczekać inicjalizacji Hub',
});
