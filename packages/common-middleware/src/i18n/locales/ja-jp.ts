import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() が複数回呼び出される',
  },
});
