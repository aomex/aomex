import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  invalid_csrf_token: 'CSRF token validation failed',
});
