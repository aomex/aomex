import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() est appelé plusieurs fois',
  },
});
