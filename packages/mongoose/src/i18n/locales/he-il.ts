import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} חייב להיות מסוג Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} חייב להיות מסוג ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'עדיין לא נתמך {{validator}}',
  },
  migration: {
    create: 'צור קובץ הגירה',
    up: 'בצע הגירה',
    down: 'העברה לאחור',
    file_not_found: 'קובץ ההעברה "{{file}}" אינו קיים',
    input_file_name: 'נא להזין את שם קובץ ההעברה:',
    file_created: 'קובץ ההעברה נוצר בהצלחה "{{file}}"',
  },
});
