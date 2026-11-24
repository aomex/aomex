import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub បានបិទ ពុំអាចផ្សាយបានទេ',
  resync_failed: 'បរាជ័យក្នុងការស្ដារការជាវ Redis',
  sync_room_failed: 'បរាជ័យក្នុងការតម្រឹមការជាវបន្ទប់៖ {{room}}',
  bus_fanout_failed: 'ការចែកចាយលើប៊ូសបានបរាជ័យ',
  destroy_ready_failed: 'ការរង់ចាំការចាប់ផ្តើម Hub ពេលបិទបានបរាជ័យ',
});
