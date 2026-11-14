import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} peab olema tüüp Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} peab olema tüübiga ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Pole veel toetatud. {{validator}}',
  },
  migration: {
    create: 'Looge migratsioonifail',
    up: 'Käivitage migratsioon',
    down: 'Tagasipööramine',
    file_not_found: 'Migratsioonifaili "{{file}}" pole olemas',
    input_file_name: 'Sisestage migratsioonifaili nimi:',
    file_created: 'Migratsioonifail loodi edukalt "{{file}}"',
  },
});
