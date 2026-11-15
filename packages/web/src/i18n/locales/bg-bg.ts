import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} трябва да е файл',
      too_large: 'Файлът {{label}} е твърде голям',
      unsupported_mimetype: 'Файловият тип {{label}} не се поддържа',
      invalid_mimetype_token: 'Невалиден медиен тип или файлово разширение: {{token}}',
    },
  },
  response: {
    redirect: 'Пренасочване към {{url}}',
  },
});
