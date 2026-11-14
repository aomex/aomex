import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ஒரு கோப்பாக இருக்க வேண்டும்',
      too_large: '{{label}} கோப்பு மிகவும் பெரியது',
      unsupported_mimetype: '{{label}} இன் கோப்பு வகை ஆதரிக்கப்படவில்லை',
    },
  },
  response: {
    redirect: '{{url}} க்கு திருப்பி விடப்படுகிறது',
  },
});
