import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} должен быть файлом',
      too_large: 'Файл {{label}} слишком велик.',
      unsupported_mimetype: 'Тип файла {{label}} не поддерживается.',
      invalid_mimetype_token: 'Недопустимый тип медиа или расширение файла: {{token}}',
    },
  },
  response: {
    redirect: 'Перенаправление на {{url}}',
  },
});
