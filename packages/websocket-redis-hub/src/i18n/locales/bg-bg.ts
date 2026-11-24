import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub е затворен, излъчването е невъзможно',
  resync_failed: 'Възстановяването на абонаментите в Redis не успя',
  sync_room_failed: 'Подравняването на абонамента за стаята не успя: {{room}}',
  bus_fanout_failed: 'Разпращането по шината не успя',
  destroy_ready_failed: 'Изчакването на инициализацията на Hub при спиране не успя',
});
