import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() se llama varias veces',
  },
});
