import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub est fermé, diffusion impossible',
  resync_failed: 'Échec de la restauration des abonnements Redis',
  sync_room_failed: 'Échec de l’alignement de l’abonnement de salon : {{room}}',
  bus_fanout_failed: 'Échec de la diffusion sur le bus',
  destroy_ready_failed: 'Échec de l’attente d’initialisation du Hub à l’arrêt',
});
