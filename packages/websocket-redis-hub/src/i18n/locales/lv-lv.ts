import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub ir aizvērts, apraide nav iespējama',
  resync_failed: 'Neizdevās atjaunot Redis abonementus',
  sync_room_failed: 'Neizdevās saskaņot telpas abonementu: {{room}}',
  bus_fanout_failed: 'Kopnes fanout neizdevās',
  destroy_ready_failed: 'Aizverot neizdevās sagaidīt Hub inicializāciju',
});
