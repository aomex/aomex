import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} एक फ़ाइल होनी चाहिए',
      too_large: '{{label}} फ़ाइल बहुत बड़ी है',
      unsupported_mimetype: 'फ़ाइल प्रकार {{label}} समर्थित नहीं है',
    },
  },
  response: {
    redirect: '{{url}} पर पुनर्निर्देशित किया जा रहा है',
  },
});
