import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Недопустимый размер в байтах: {{value}}',
  invalid_duration: 'Недопустимая длительность: {{value}}',
});
