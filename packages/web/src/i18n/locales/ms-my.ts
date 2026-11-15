import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} mestilah fail',
      too_large: 'Fail {{label}} terlalu besar',
      unsupported_mimetype: 'Jenis fail {{label}} tidak disokong',
      invalid_mimetype_token: 'Jenis media atau sambungan fail tidak sah: {{token}}',
    },
  },
  response: {
    redirect: 'Mengalihkan ke {{url}}',
  },
});
