import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() Birden çok kez arandı',
  },
});
