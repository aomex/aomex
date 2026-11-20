import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Неважећа величина у бајтовима: {{value}}',
  invalid_duration: 'Неважеће трајање: {{value}}',
});
