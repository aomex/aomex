import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'call next() multiple times',
  },
});
