import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  eject: 'ನಿಗದಿತ ಕಾರ್ಯ ಪಟ್ಟಿಯನ್ನು ರಫ್ತು ಮಾಡಿ',
  start: 'ನಿಗದಿತ ಕಾರ್ಯವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
  stop: 'ನಿಗದಿತ ಕಾರ್ಯಗಳನ್ನು ನಿಲ್ಲಿಸಿ',
  stats: 'ನಿಗದಿತ ಕಾರ್ಯಗಳ ಎಕ್ಸಿಕ್ಯೂಶನ್ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
  not_started: 'ನಿಗದಿತ ಕಾರ್ಯವನ್ನು ಪ್ರಾರಂಭಿಸಲಾಗಿಲ್ಲ, ಪೋರ್ಟ್: {{port}}',
  invalid_cron_time: 'ಅಮಾನ್ಯವಾದ ಕ್ರಾನ್ ಅಭಿವ್ಯಕ್ತಿ: {{time}}',
  invalid_port: 'ಅಮಾನ್ಯ ಸರ್ವರ್ ಪೋರ್ಟ್: {{port}} (ಮಾನ್ಯ ವ್ಯಾಪ್ತಿ: 1-65535)',
});
