import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub закрито, трансляція неможлива',
  resync_failed: 'Не вдалося відновити підписки Redis',
  sync_room_failed: 'Не вдалося вирівняти підписку кімнати: {{room}}',
  bus_fanout_failed: 'Збій розсилки шиною',
  destroy_ready_failed: 'Під час завершення не вдалося дочекатися ініціалізації Hub',
});
