import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub је затворен, емитовање није могуће',
  resync_failed: 'Обнављање Redis претплата није успело',
  sync_room_failed: 'Усклађивање претплате собе није успело: {{room}}',
  bus_fanout_failed: 'Расподела по магистрали није успела',
  destroy_ready_failed: 'Чекање иницијализације Hub-а при гашењу није успело',
});
