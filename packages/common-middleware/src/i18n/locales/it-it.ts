import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() viene chiamato più volte',
  },
});
