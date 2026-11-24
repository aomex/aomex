import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub закрыт, трансляция невозможна',
  resync_failed: 'Не удалось восстановить подписки Redis',
  sync_room_failed: 'Не удалось выровнять подписку комнаты: {{room}}',
  bus_fanout_failed: 'Сбой рассылки по шине',
  destroy_ready_failed: 'При остановке не удалось дождаться инициализации Hub',
});
