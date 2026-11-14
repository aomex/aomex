import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} חייב להיות קובץ',
      too_large: 'קובץ {{label}} גדול מדי',
      unsupported_mimetype: 'סוג הקובץ {{label}} אינו נתמך',
    },
  },
  response: {
    redirect: 'מפנה אל {{url}}',
  },
});
