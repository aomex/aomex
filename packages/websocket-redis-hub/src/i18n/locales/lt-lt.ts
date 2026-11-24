import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub uždarytas, transliuoti negalima',
  resync_failed: 'Nepavyko atkurti Redis prenumeratų',
  sync_room_failed: 'Nepavyko sulyginti kambario prenumeratos: {{room}}',
  bus_fanout_failed: 'Magistralės fanout nepavyko',
  destroy_ready_failed: 'Išjungiant nepavyko sulaukti Hub iniciacijos',
});
