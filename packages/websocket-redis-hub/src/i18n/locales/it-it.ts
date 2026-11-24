import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub è chiuso, impossibile trasmettere',
  resync_failed: 'Ripristino delle sottoscrizioni Redis non riuscito',
  sync_room_failed:
    'Allineamento della sottoscrizione della stanza non riuscito: {{room}}',
  bus_fanout_failed: 'Fanout del bus non riuscito',
  destroy_ready_failed:
    'Attesa dell’inizializzazione dell’Hub durante l’arresto non riuscita',
});
