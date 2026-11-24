import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub je zaprt, oddajanje ni mogoče',
  resync_failed: 'Obnova naročnin Redis ni uspela',
  sync_room_failed: 'Uskladitev naročnine sobe ni uspela: {{room}}',
  bus_fanout_failed: 'Fanout vodila ni uspel',
  destroy_ready_failed: 'Čakanje na inicializacijo Huba ob zaustavitvi ni uspelo',
});
