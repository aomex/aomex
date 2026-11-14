import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} turi būti dešimtainio 128 tipo',
    },
    objectId: {
      must_be_objectId: '{{label}} turi būti ObjectId tipo',
    },
  },
  mongoose: {
    unsupported_validator: 'Dar nepalaikoma {{validator}}',
  },
  migration: {
    create: 'Sukurti migracijos failą',
    up: 'Vykdyti migraciją',
    down: 'Perkėlimas atgal',
    file_not_found: 'Perkėlimo failas „{{file}}“ neegzistuoja',
    input_file_name: 'Įveskite perkėlimo failo pavadinimą:',
    file_created: 'Perkėlimo failas sėkmingai sukurtas „{{file}}“',
  },
});
