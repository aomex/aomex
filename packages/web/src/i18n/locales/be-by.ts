import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} павінен быць файлам',
      too_large: 'Файл {{label}} занадта вялікі',
      unsupported_mimetype: 'Тып файла {{label}} не падтрымліваецца',
    },
  },
  response: {
    redirect: 'Перанакіраванне на {{url}}',
  },
});
