import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uz-UZ */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Fayl boʻlishi kerak',
      too_large: '{{label}} Fayl juda katta',
      unsupported_mimetype: '{{label}} fayl turi qoʻllab-quvvatlanmaydi',
    },
  },
  response: {
    redirect: '{{url}} ga yo‘naltirilmoqda',
  },
});
