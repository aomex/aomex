import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub داخراوە، پەخش ناکرێت',
  resync_failed: 'گەڕاندنەوەی بەشداریکردنی Redis سەرکەوتوو نەبوو',
  sync_room_failed: 'ڕێکخستنی بەشداریکردنی ژوورەکە سەرکەوتوو نەبوو: {{room}}',
  bus_fanout_failed: 'بڵاوکردنەوەی پاس سەرکەوتوو نەبوو',
  destroy_ready_failed: 'لە کاتی داخستندا چاوەڕوانی دەستپێکردنی Hub سەرکەوتوو نەبوو',
});
