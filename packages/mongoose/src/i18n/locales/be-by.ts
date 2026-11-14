import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** be-BY */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} павінен быць тыпу Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} павінен быць тыпу ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Пакуль не падтрымліваецца {{validator}}',
  },
  migration: {
    create: 'Стварыць файл міграцыі',
    up: 'Выканаць міграцыю',
    down: 'Адкатная міграцыя',
    file_not_found: 'Файл міграцыі "{{file}}" не існуе',
    input_file_name: 'Увядзіце імя файла міграцыі:',
    file_created: 'Файл міграцыі быў паспяхова створаны "{{file}}"',
  },
});
