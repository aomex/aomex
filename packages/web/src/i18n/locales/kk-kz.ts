import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} файл болуы керек',
      too_large: '{{label}} файлы тым үлкен',
      unsupported_mimetype: '{{label}} файл түріне қолдау көрсетілмейді',
    },
  },
  response: {
    redirect: '{{url}} мекенжайына қайта бағытталуда',
  },
});
