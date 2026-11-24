import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub está cerrado, no se puede difundir',
  resync_failed: 'Error al restaurar las suscripciones de Redis',
  sync_room_failed: 'Error al alinear la suscripción de la sala: {{room}}',
  bus_fanout_failed: 'Error en la difusión del bus',
  destroy_ready_failed: 'Error al esperar la inicialización del Hub durante el cierre',
});
