import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '.\n{{label}} دەبێت فایلێک بێت',
      too_large: '.\nفایلە {{label}} زۆر گەورەیە',
      unsupported_mimetype: '.\nجۆری پەڕگەی {{label}} پشتگیری ناکرێت',
    },
  },
  response: {
    redirect: 'ئاڕاستەکردن بۆ {{url}}',
  },
});
