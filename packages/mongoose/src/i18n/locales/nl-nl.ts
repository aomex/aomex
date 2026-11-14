import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} moet van het type Decimal128 zijn',
    },
    objectId: {
      must_be_objectId: '{{label}} moet van het type ObjectId zijn',
    },
  },
  mongoose: {
    unsupported_validator: 'Nog niet ondersteund {{validator}}',
  },
  migration: {
    create: 'Migratiebestand maken',
    up: 'Voer migratie uit',
    down: 'Rollback-migratie',
    file_not_found: 'Het migratiebestand "{{file}}" bestaat niet',
    input_file_name: 'Voer de naam van het migratiebestand in:',
    file_created: 'Het migratiebestand is succesvol aangemaakt "{{file}}"',
  },
});
