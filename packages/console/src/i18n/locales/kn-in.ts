import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  command_not_found: '"{{command}}" ಆಜ್ಞೆಯು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ',
  command_found_recommended:
    '"{{command}}" ಆಜ್ಞೆಯು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ. ನಿಮ್ಮ ಪ್ರಕಾರ "aomex {{recommended}}"?',
  help: {
    command: '[ಆಜ್ಞೆ]',
    option: '[ಆಯ್ಕೆಗಳು]',
    version: '{{scriptName}} ನ ಆವೃತ್ತಿ ಸಂಖ್ಯೆಯನ್ನು ಪ್ರದರ್ಶಿಸಿ',
    no_usage: '"{{command}}" ಆಜ್ಞೆಯ ಬಳಕೆಯನ್ನು ಕಂಡುಹಿಡಿಯಲಾಗುವುದಿಲ್ಲ',
  },
});
