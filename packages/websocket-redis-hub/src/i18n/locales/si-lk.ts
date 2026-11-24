import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub වසා ඇත, විකාශනය කළ නොහැක',
  resync_failed: 'Redis දායකත්ව යථා තත්ත්වයට පත් කළ නොහැකි විය',
  sync_room_failed: 'කාමර දායකත්වය ගැලපීම අසාර්ථක විය: {{room}}',
  bus_fanout_failed: 'බස් පැතිරවීම අසාර්ථක විය',
  destroy_ready_failed: 'වසන විට Hub ආරම්භය බලා සිටීම අසාර්ථක විය',
});
