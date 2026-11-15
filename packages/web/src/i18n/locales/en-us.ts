import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} must be a file',
      too_large: '{{label}} is too large',
      unsupported_mimetype: '{{label}} has an unsupported file type',
      invalid_mimetype_token: 'Invalid media type or file extension: {{token}}',
    },
  },
  response: {
    redirect: 'Redirecting to {{url}}',
  },
});
