import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kn-IN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ಒಂದು ಫೈಲ್ ಆಗಿರಬೇಕು',
      too_large: '{{label}} ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ',
      unsupported_mimetype: 'ಫೈಲ್ ಪ್ರಕಾರ {{label}} ಬೆಂಬಲಿತವಾಗಿಲ್ಲ',
    },
  },
  response: {
    redirect: '{{url}} ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗುತ್ತಿದೆ',
  },
});
