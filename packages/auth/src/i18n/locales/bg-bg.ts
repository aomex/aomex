import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-bg */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Неуспешно създаване на сесия: многократните опити за запис се провалиха, проверете адаптера за съхранение',
  session_max_age_invalid: 'cookie.maxAge трябва да е положително число (в секунди)',
});
