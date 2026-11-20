import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  invalid_bytes: 'Nevažeća veličina u bajtovima: {{value}}',
  invalid_duration: 'Nevažeće trajanje: {{value}}',
});
