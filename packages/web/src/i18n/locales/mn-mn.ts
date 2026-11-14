import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} нь файл байх ёстой',
      too_large: '{{label}} файл хэт том байна',
      unsupported_mimetype: '{{label}} файлын төрлийг дэмждэггүй',
    },
  },
  response: {
    redirect: '{{url}} руу дахин чиглүүлж байна',
  },
});
