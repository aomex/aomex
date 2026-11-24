import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub er lukket og kan ikke kringkaste',
  resync_failed: 'Klarte ikke å gjenopprette Redis-abonnementer',
  sync_room_failed: 'Klarte ikke å justere romabonnementet: {{room}}',
  bus_fanout_failed: 'Buss-fanout mislyktes',
  destroy_ready_failed: 'Klarte ikke å vente på Hub-initialisering ved avslutning',
});
