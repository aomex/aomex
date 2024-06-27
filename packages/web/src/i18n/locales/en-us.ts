import { i18n } from '@aomex/core';

i18n.register('en_US', 'web', {
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
