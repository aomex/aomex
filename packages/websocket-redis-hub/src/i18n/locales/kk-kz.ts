import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub жабық, тарату мүмкін емес',
  resync_failed: 'Redis жазылымдарын қалпына келтіру сәтсіз аяқталды',
  sync_room_failed: 'Бөлме жазылымын туралау сәтсіз аяқталды: {{room}}',
  bus_fanout_failed: 'Шина бойынша тарату сәтсіз аяқталды',
  destroy_ready_failed: 'Жабу кезінде Hub инициализациясын күту сәтсіз аяқталды',
});
