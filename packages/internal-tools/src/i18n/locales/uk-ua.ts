import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Недійсний розмір у байтах: {{value}}',
  invalid_duration: 'Недійсна тривалість: {{value}}',
});
