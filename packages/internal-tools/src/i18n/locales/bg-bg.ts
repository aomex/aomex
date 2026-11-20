import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Невалиден размер в байтове: {{value}}',
  invalid_duration: 'Невалидна продължителност: {{value}}',
});
