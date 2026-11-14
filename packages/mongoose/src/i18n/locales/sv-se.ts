import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} måste vara av typen Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} måste vara av typen ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Stöds inte ännu {{validator}}',
  },
  migration: {
    create: 'Skapa migreringsfil',
    up: 'Utför migrering',
    down: 'Återställ migrering',
    file_not_found: 'Migreringsfilen "{{file}}" finns inte',
    input_file_name: 'Ange namnet på migreringsfilen:',
    file_created: 'Migreringsfilen skapades framgångsrikt "{{file}}"',
  },
});
