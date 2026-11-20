import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-ru */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Не удалось создать сеанс: несколько попыток записи не удались, проверьте адаптер хранилища',
  session_max_age_invalid: 'cookie.maxAge должен быть положительным числом (в секундах)',
});
