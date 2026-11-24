import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  hub_closed: 'RedisHub is closed; cannot broadcast',
  resync_failed: 'Failed to restore Redis subscriptions',
  sync_room_failed: 'Failed to align room subscription: {{room}}',
  bus_fanout_failed: 'Bus fanout failed',
  destroy_ready_failed: 'Failed while waiting for Hub initialization during shutdown',
});
