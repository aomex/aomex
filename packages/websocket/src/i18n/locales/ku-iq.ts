import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'ناوی ڕووداوی نادروست',
  invalid_room_name: 'ناوی ژووری نادروست',
  unknown_event: 'ڕووداوی نەناسراو: {{event}}',
  handler_error: 'پرۆسێسی ڕووداو سەرکەوتوو نەبوو',
  duplicate_event: 'ڕووداو پێشتر تۆمار کراوە: {{event}}',
  already_attached: 'WebsocketApp پێشتر attach کراوە، نابێت دووبارە ببەسترێتەوە',
  transport_init_failed: 'دەستپێکردنی گواستنەوەی WebSocket سەرکەوتوو نەبوو',
  handshake_failed: 'دەستگرتنی WebSocket سەرکەوتوو نەبوو',
  accept_failed: 'پەیوەندی وەرنەگیرا',
  fanout_deliver_failed:
    'لە کاتی بڵاوکردنەوەدا نووسین بۆ {{failed}} پەیوەندی سەرکەوتوو نەبوو',
  inbound_task_failed: 'پرۆسێسی ڕووداوی هاتوو سەرکەوتوو نەبوو',
  error_frame_failed: 'چوارچێوەی هەڵە نەنێردرا',
  remove_client_failed: 'سەرکەوتوو نەبوو لە لابردنی پەیوەندی',
  close_connection_failed: 'سەرکەوتوو نەبوو لە داخستنی پەیوەندی',
  metric_handler_failed: 'گەڕانەوەی پێوەر سەرکەوتوو نەبوو',
});
