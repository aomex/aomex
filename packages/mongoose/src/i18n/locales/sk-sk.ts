import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} musí byť typu Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} musí byť typu ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Zatiaľ nie je podporované {{validator}}',
  },
  migration: {
    create: 'Vytvorte migračný súbor',
    up: 'Vykonajte migráciu',
    down: 'Rollback migrácia',
    file_not_found: 'Migračný súbor "{{file}}" neexistuje',
    input_file_name: 'Zadajte názov súboru migrácie:',
    file_created: 'Migračný súbor bol úspešne vytvorený "{{file}}"',
  },
});
