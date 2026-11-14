import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} trebuie să fie de tipul Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} trebuie să fie de tip ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Nu este acceptat încă {{validator}}',
  },
  migration: {
    create: 'Creați fișierul de migrare',
    up: 'Executați migrarea',
    down: 'Migrarea înapoi',
    file_not_found: 'Fișierul de migrare „{{file}}” nu există',
    input_file_name: 'Introduceți numele fișierului de migrare:',
    file_created: 'Fișierul de migrare a fost creat cu succes „{{file}}”',
  },
});
