import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() wordt meerdere keren aangeroepen',
  },
});
