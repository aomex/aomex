import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} має бути типу Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} має бути типу ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ще не підтримується {{validator}}',
  },
  migration: {
    create: 'Створити файл міграції',
    up: 'Виконати міграцію',
    down: 'Відкат міграції',
    file_not_found: 'Файл міграції "{{file}}" не існує',
    input_file_name: 'Введіть назву файлу міграції:',
    file_created: 'Файл міграції створено успішно "{{file}}"',
  },
});
