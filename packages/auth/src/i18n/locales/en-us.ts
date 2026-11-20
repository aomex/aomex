import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  session_create_failed:
    'Failed to create session: write attempts exhausted; check the storage adapter',
  session_max_age_invalid: 'cookie.maxAge must be a positive number (in seconds)',
});
