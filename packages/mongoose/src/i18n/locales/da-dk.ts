import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} skal være af typen Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} skal være af typen ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ikke understøttet endnu {{validator}}',
  },
  migration: {
    create: 'Opret migreringsfil',
    up: 'Udfør migration',
    down: 'Rollback-migrering',
    file_not_found: 'Migrationsfilen "{{file}}" findes ikke',
    input_file_name: 'Indtast migreringsfilens navn:',
    file_created: 'Migreringsfilen blev oprettet "{{file}}"',
  },
});
