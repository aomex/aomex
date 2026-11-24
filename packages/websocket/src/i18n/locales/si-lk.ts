import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** si-LK */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'අවලංගු සිදුවීමේ නම',
  invalid_room_name: 'අවලංගු කාමරයේ නම',
  unknown_event: 'නොදන්නා සිදුවීම: {{event}}',
  handler_error: 'සිදුවීම සැකසීම අසාර්ථක විය',
  duplicate_event: 'සිදුවීම දැනටමත් ලියාපදිංචි කර ඇත: {{event}}',
  already_attached: 'WebsocketApp දැනටමත් attach කර ඇත, නැවත සවි නොකරන්න',
  transport_init_failed: 'WebSocket ප්‍රවාහනය ආරම්භ කළ නොහැකි විය',
  handshake_failed: 'WebSocket හස්තදානය අසාර්ථක විය',
  accept_failed: 'සම්බන්ධතාව පිළිගත නොහැකි විය',
  fanout_deliver_failed: 'පැතිරවීමේදී සම්බන්ධතා {{failed}} කට ලිවීම අසාර්ථක විය',
  inbound_task_failed: 'ඇතුළට එන සිදුවීම සැකසීම අසාර්ථක විය',
  error_frame_failed: 'දෝෂ රාමුව යැවීම අසාර්ථක විය',
  remove_client_failed: 'සම්බන්ධතාව ඉවත් කිරීම අසාර්ථක විය',
  close_connection_failed: 'සම්බන්ධතාව වසා දැමීම අසාර්ථක විය',
  metric_handler_failed: 'මෙට්‍රික් ආපසු ඇමතුම අසාර්ථක විය',
});
