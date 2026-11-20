import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-mk */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Не може да се создаде сесија: повеќекратни обиди за запишување неуспеа, проверете го адаптерот за складирање',
  session_max_age_invalid: 'cookie.maxAge мора да биде позитивен број (во секунди)',
});
