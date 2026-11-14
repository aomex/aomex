import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ದಶಮಾಂಶ128 ಪ್ರಕಾರವಾಗಿರಬೇಕು',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId ಪ್ರಕಾರವಾಗಿರಬೇಕು',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} ಇನ್ನೂ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
  },
  migration: {
    create: 'ವಲಸೆ ಫೈಲ್ ರಚಿಸಿ',
    up: 'ವಲಸೆಯನ್ನು ಕಾರ್ಯಗತಗೊಳಿಸಿ',
    down: 'ರೋಲ್ಬ್ಯಾಕ್ ವಲಸೆ',
    file_not_found: '"{{file}}" ವಲಸೆ ಫೈಲ್ ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ',
    input_file_name: 'ದಯವಿಟ್ಟು ವಲಸೆ ಫೈಲ್ ಹೆಸರನ್ನು ನಮೂದಿಸಿ:',
    file_created: 'ವಲಸೆ ಫೈಲ್ ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ "{{file}}" ರಚಿಸಲಾಗಿದೆ',
  },
});
