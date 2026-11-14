import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** 繁體中文（台灣） */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next() 被呼叫了多次',
  },
});
