import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub està tancat, no es pot difondre',
  resync_failed: 'No s’han pogut restaurar les subscripcions de Redis',
  sync_room_failed: 'No s’ha pogut alinear la subscripció de la sala: {{room}}',
  bus_fanout_failed: 'Ha fallat la difusió del bus',
  destroy_ready_failed: 'Ha fallat l’espera d’inicialització del Hub en tancar',
});
