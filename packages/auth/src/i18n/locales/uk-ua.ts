import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-ua */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Не вдалося створити сеанс: кілька спроб запису не вдалися, перевірте адаптер сховища',
  session_max_age_invalid: 'cookie.maxAge має бути додатним числом (у секундах)',
});
