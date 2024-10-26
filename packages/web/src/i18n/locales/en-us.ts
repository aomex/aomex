import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}}: must be file',
      too_large: '{{label}}: file size too large',
      unsupported_mimetype: '{{label}}: unsupported file mimetype',
    },
  },
  response: {
    redirect: 'Redirecting to {{url}}',
  },
});
