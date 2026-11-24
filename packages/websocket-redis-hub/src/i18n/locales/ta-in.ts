import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub மூடப்பட்டுள்ளது, ஒலிபரப்ப முடியாது',
  resync_failed: 'Redis சந்தாக்களை மீட்டெடுக்க முடியவில்லை',
  sync_room_failed: 'அறையின் சந்தாவை சீரமைக்க முடியவில்லை: {{room}}',
  bus_fanout_failed: 'பஸ் பரப்பல் தோல்வியடைந்தது',
  destroy_ready_failed: 'மூடும்போது Hub தொடக்கத்திற்காக காத்திருப்பது தோல்வியடைந்தது',
});
