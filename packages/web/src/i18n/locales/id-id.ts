import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} harus berupa file',
      too_large: 'File {{label}} terlalu besar',
      unsupported_mimetype: 'Jenis file {{label}} tidak didukung',
    },
  },
  response: {
    redirect: 'Mengalihkan ke {{url}}',
  },
});
