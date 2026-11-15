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
});
