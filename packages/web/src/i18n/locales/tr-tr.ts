import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Bir dosya olmalı',
      too_large: '{{label}} Dosya çok büyük',
      unsupported_mimetype: '{{label}} dosya türü desteklenmiyor',
    },
  },
  response: {
    redirect: '{{url}} adresine yönlendiriliyor',
  },
});
