import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kk-KZ */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Decimal128 түрі болуы керек',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId түрі болуы керек',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} әлі қолдау көрсетілмейді',
  },
  migration: {
    create: 'Тасымалдау файлын жасаңыз',
    up: 'Көшіруді орындау',
    down: 'Кері тасымалдау',
    file_not_found: '"{{file}}" тасымалдау файлы жоқ',
    input_file_name: 'Тасымалдау файлының атын енгізіңіз:',
    file_created: '"{{file}}" тасымалдау файлы сәтті жасалды.',
  },
});
