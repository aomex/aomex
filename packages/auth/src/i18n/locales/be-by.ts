import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-by */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Не ўдалося стварыць сеанс: некалькі спроб запісу не ўдаліся, праверце адаптар сховішча',
  session_max_age_invalid: 'cookie.maxAge павінен быць дадатным лікам (у секундах)',
});
