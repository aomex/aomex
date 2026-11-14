import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} mora biti tipa Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} mora biti tipa ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Još nije podržano {{validator}}',
  },
  migration: {
    create: 'Stvorite datoteku za migraciju',
    up: 'Izvršite migraciju',
    down: 'Povratna migracija',
    file_not_found: 'Migracijska datoteka "{{file}}" ne postoji',
    input_file_name: 'Unesite naziv datoteke za migraciju:',
    file_created: 'Migracijska datoteka je uspješno kreirana "{{file}}"',
  },
});
