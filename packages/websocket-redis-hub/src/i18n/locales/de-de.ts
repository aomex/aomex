import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub ist geschlossen, Broadcast nicht möglich',
  resync_failed: 'Wiederherstellen der Redis-Abonnements fehlgeschlagen',
  sync_room_failed: 'Abgleich des Raum-Abonnements fehlgeschlagen: {{room}}',
  bus_fanout_failed: 'Bus-Fanout fehlgeschlagen',
  destroy_ready_failed:
    'Warten auf die Hub-Initialisierung beim Herunterfahren fehlgeschlagen',
});
