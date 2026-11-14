import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() को कई बार कहा जाता है',
  },
});
