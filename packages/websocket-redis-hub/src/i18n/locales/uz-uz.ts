import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub yopilgan, efirga uzatib boʻlmaydi',
  resync_failed: 'Redis obunalarini tiklab bo‘lmadi',
  sync_room_failed: 'Xona obunasini moslab bo‘lmadi: {{room}}',
  bus_fanout_failed: 'Shina orqali tarqatish amalga oshmadi',
  destroy_ready_failed: 'Yopishda Hub ishga tushishini kutib bo‘lmadi',
});
