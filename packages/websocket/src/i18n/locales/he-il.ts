import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'שם אירוע לא חוקי',
  invalid_room_name: 'שם חדר לא חוקי',
  unknown_event: 'אירוע לא ידוע: {{event}}',
  handler_error: 'עיבוד האירוע נכשל',
  duplicate_event: 'האירוע כבר רשום: {{event}}',
  already_attached: 'WebsocketApp כבר attach, אין לחבר שוב',
  transport_init_failed: 'אתחול תעבורת WebSocket נכשל',
  handshake_failed: 'לחיצת היד של WebSocket נכשלה',
  accept_failed: 'קבלת החיבור נכשלה',
  fanout_deliver_failed: 'כתיבה ל-{{failed}} חיבורים נכשלה במהלך הפיזור',
  inbound_task_failed: 'עיבוד האירוע הנכנס נכשל',
  error_frame_failed: 'שליחת מסגרת השגיאה נכשלה',
  remove_client_failed: 'הסרת החיבור נכשלה',
  close_connection_failed: 'סגירת החיבור נכשלה',
  metric_handler_failed: 'החזרת המדדים נכשלה',
});
