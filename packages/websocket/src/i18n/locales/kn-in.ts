import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'ಅಮಾನ್ಯ ಈವೆಂಟ್ ಹೆಸರು',
  invalid_room_name: 'ಅಮಾನ್ಯ ಕೊಠಡಿಯ ಹೆಸರು',
  unknown_event: 'ಅಪರಿಚಿತ ಈವೆಂಟ್: {{event}}',
  handler_error: 'ಈವೆಂಟ್ ಸಂಸ್ಕರಣೆ ವಿಫಲವಾಗಿದೆ',
  duplicate_event: 'ಈವೆಂಟ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಲಾಗಿದೆ: {{event}}',
  already_attached: 'WebsocketApp ಈಗಾಗಲೇ attach ಆಗಿದೆ, ಮತ್ತೆ ಅಳವಡಿಸಬೇಡಿ',
  transport_init_failed: 'WebSocket ಸಾರಿಗೆಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  handshake_failed: 'WebSocket ಹ್ಯಾಂಡ್‌ಶೇಕ್ ವಿಫಲವಾಗಿದೆ',
  accept_failed: 'ಸಂಪರ್ಕವನ್ನು ಸ್ವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  fanout_deliver_failed: 'ಫ್ಯಾನ್‌ಔಟ್ ಸಮಯದಲ್ಲಿ {{failed}} ಸಂಪರ್ಕಗಳಿಗೆ ಬರೆಯುವುದು ವಿಫಲವಾಗಿದೆ',
  inbound_task_failed: 'ಒಳಬರುವ ಈವೆಂಟ್ ಅನ್ನು ಸಂಸ್ಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  error_frame_failed: 'ದೋಷ ಫ್ರೇಮ್ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  remove_client_failed: 'ಸಂಪರ್ಕವನ್ನು ತೆಗೆದುಹಾಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  close_connection_failed: 'ಸಂಪರ್ಕವನ್ನು ಮುಚ್ಚಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  metric_handler_failed: 'ಮೆಟ್ರಿಕ್ ಕಾಲ್‌ಬ್ಯಾಕ್ ವಿಫಲವಾಗಿದೆ',
});
