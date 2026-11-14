import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} мора да биде од типот Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} мора да биде од типот ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Сè уште не е поддржано {{validator}}',
  },
  migration: {
    create: 'Креирајте датотека за миграција',
    up: 'Извршете миграција',
    down: 'Повратна миграција',
    file_not_found: 'Датотеката за миграција „{{file}}“ не постои',
    input_file_name: 'Ве молиме внесете го името на датотеката за миграција:',
    file_created: 'Датотеката за миграција беше успешно креирана „{{file}}“',
  },
});
