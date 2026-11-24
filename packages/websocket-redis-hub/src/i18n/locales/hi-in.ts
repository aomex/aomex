import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub बंद है, प्रसारण नहीं हो सकता',
  resync_failed: 'Redis सदस्यताएँ पुनर्स्थापित नहीं हो सकीं',
  sync_room_failed: 'कमरे की सदस्यता संरेखित नहीं हो सकी: {{room}}',
  bus_fanout_failed: 'बस फैनआउट विफल रहा',
  destroy_ready_failed: 'बंद करते समय Hub आरंभीकरण की प्रतीक्षा विफल रही',
});
