import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'தவறான நிகழ்வு பெயர்',
  invalid_room_name: 'தவறான அறை பெயர்',
  unknown_event: 'அறியப்படாத நிகழ்வு: {{event}}',
  handler_error: 'நிகழ்வு செயலாக்கம் தோல்வியடைந்தது',
  duplicate_event: 'நிகழ்வு ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது: {{event}}',
  already_attached: 'WebsocketApp ஏற்கனவே attach செய்யப்பட்டுள்ளது, மீண்டும் பொருத்த வேண்டாம்',
  transport_init_failed: 'WebSocket போக்குவரத்தை தொடங்க முடியவில்லை',
  handshake_failed: 'WebSocket கைகுலுக்கல் தோல்வியடைந்தது',
  accept_failed: 'இணைப்பை ஏற்க முடியவில்லை',
  fanout_deliver_failed: 'பரப்பலின் போது {{failed}} இணைப்புகளில் எழுதுதல் தோல்வியடைந்தது',
  inbound_task_failed: 'உள்வரும் நிகழ்வை செயலாக்க முடியவில்லை',
  error_frame_failed: 'பிழை சட்டத்தை அனுப்ப முடியவில்லை',
  remove_client_failed: 'இணைப்பை நீக்க முடியவில்லை',
  close_connection_failed: 'இணைப்பை மூட முடியவில்லை',
  metric_handler_failed: 'அளவீட்டு திருப்பழைப்பு தோல்வியடைந்தது',
});
