import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() jest wywoływany wielokrotnie',
  },
});
