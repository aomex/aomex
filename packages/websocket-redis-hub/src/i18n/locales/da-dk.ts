import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub er lukket og kan ikke udsende',
  resync_failed: 'Gendannelse af Redis-abonnementer mislykkedes',
  sync_room_failed: 'Justering af rumabonnement mislykkedes: {{room}}',
  bus_fanout_failed: 'Bus-fanout mislykkedes',
  destroy_ready_failed: 'Ventetid på Hub-initialisering under nedlukning mislykkedes',
});
