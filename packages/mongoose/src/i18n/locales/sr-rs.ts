import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: 'ЗЗ0ЗЗ мора бити типа Децимал128',
    },
    objectId: {
      must_be_objectId: 'ЗЗ0ЗЗ мора бити типа ОбјецтИд',
    },
  },
  mongoose: {
    unsupported_validator: 'Још увек није подржан ЗЗ0ЗЗ',
  },
  migration: {
    create: 'Креирајте датотеку за миграцију',
    up: 'Изврши миграцију',
    down: 'Реллбацк миграција',
    file_not_found: 'Датотека за миграцију „ЗЗ0ЗЗ“ не постоји',
    input_file_name: 'Унесите назив датотеке за миграцију:',
    file_created: 'Датотека за миграцију је успешно креирана „ЗЗ0ЗЗ“',
  },
});
