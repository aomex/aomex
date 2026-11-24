import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub je uzavřen, vysílání není možné',
  resync_failed: 'Obnovení odběrů Redis selhalo',
  sync_room_failed: 'Srovnání odběru místnosti selhalo: {{room}}',
  bus_fanout_failed: 'Fanout sběrnice selhal',
  destroy_ready_failed: 'Čekání na inicializaci Hubu při vypnutí selhalo',
});
