import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() 被調用了多次',
  },
});
