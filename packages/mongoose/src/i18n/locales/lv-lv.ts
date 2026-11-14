import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ir jābūt veidam Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} tipam ir jābūt ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Vēl netiek atbalstīts {{validator}}',
  },
  migration: {
    create: 'Izveidojiet migrācijas failu',
    up: 'Veiciet migrāciju',
    down: 'Atcelšanas migrācija',
    file_not_found: 'Migrācijas fails "{{file}}" neeksistē',
    input_file_name: 'Lūdzu, ievadiet migrācijas faila nosaukumu:',
    file_created: 'Migrācijas fails tika veiksmīgi izveidots "{{file}}"',
  },
});
