import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** ko-KR */
export default I18n.satisfies(zh).define({
  middleware: {
    call_next_multiple: 'next()가 여러 번 호출되었습니다.',
  },
});
