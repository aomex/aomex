import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub is gesloten, uitzenden is niet mogelijk',
  resync_failed: 'Herstellen van Redis-abonnementen is mislukt',
  sync_room_failed: 'Afstemmen van kamerabonnement is mislukt: {{room}}',
  bus_fanout_failed: 'Bus-fanout is mislukt',
  destroy_ready_failed: 'Wachten op Hub-initialisatie bij afsluiten is mislukt',
});
