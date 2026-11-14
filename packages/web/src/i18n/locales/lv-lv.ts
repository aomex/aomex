import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} ir jābūt failam',
      too_large: '{{label}} fails ir pārāk liels',
      unsupported_mimetype: 'Faila tips {{label}} netiek atbalstīts',
    },
  },
  response: {
    redirect: 'Novirza uz {{url}}',
  },
});
