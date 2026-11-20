import { I18n } from '@i18nx/node';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  invalid_bytes: 'Invalid byte size: {{value}}',
  invalid_duration: 'Invalid duration: {{value}}',
});
