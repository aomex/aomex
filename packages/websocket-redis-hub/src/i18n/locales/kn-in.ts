import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub ಮುಚ್ಚಲಾಗಿದೆ, ಪ್ರಸಾರ ಸಾಧ್ಯವಿಲ್ಲ',
  resync_failed: 'Redis ಚಂದಾದಾರಿಕೆಗಳನ್ನು ಮರುಸ್ಥಾಪಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
  sync_room_failed: 'ಕೊಠಡಿ ಚಂದಾದಾರಿಕೆಯನ್ನು ಹೊಂದಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ: {{room}}',
  bus_fanout_failed: 'ಬಸ್ ಫ್ಯಾನ್‌ಔಟ್ ವಿಫಲವಾಗಿದೆ',
  destroy_ready_failed: 'ಮುಚ್ಚುವಾಗ Hub ಪ್ರಾರಂಭಕ್ಕಾಗಿ ಕಾಯುವುದು ವಿಫಲವಾಗಿದೆ',
});
