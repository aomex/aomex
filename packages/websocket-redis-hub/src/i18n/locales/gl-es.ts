import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub está pechado, non se pode difundir',
  resync_failed: 'Non se puideron restaurar as subscricións de Redis',
  sync_room_failed: 'Non se puido aliñar a subscrición da sala: {{room}}',
  bus_fanout_failed: 'Fallou a difusión do bus',
  destroy_ready_failed: 'Fallou a espera da inicialización do Hub ao pechar',
});
