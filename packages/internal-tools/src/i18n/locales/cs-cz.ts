import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Neplatná velikost v bajtech: {{value}}',
  invalid_duration: 'Neplatná doba trvání: {{value}}',
});
