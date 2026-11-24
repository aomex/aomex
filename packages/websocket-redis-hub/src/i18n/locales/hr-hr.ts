import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub je zatvoren, emitiranje nije moguće',
  resync_failed: 'Obnova Redis pretplata nije uspjela',
  sync_room_failed: 'Usklađivanje pretplate sobe nije uspjelo: {{room}}',
  bus_fanout_failed: 'Fanout sabirnice nije uspio',
  destroy_ready_failed: 'Čekanje inicijalizacije Huba pri gašenju nije uspjelo',
});
