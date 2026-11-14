import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** my-MM */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() ကို အကြိမ်များစွာ ခေါ်သည်။',
  },
});
