import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  too_many_requests: 'Too many requests',
  denied: 'Denied',
});
