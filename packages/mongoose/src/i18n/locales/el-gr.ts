import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: 'Το {{label}} πρέπει να είναι τύπου Decimal128',
    },
    objectId: {
      must_be_objectId: 'Το {{label}} πρέπει να είναι τύπου ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Δεν υποστηρίζεται ακόμα {{validator}}',
  },
  migration: {
    create: 'Δημιουργία αρχείου μετεγκατάστασης',
    up: 'Εκτέλεση μετεγκατάστασης',
    down: 'Επαναφορά μετεγκατάστασης',
    file_not_found: 'Το αρχείο μετεγκατάστασης "{{file}}" δεν υπάρχει',
    input_file_name: 'Εισαγάγετε το όνομα του αρχείου μετεγκατάστασης:',
    file_created: 'Το αρχείο μετεγκατάστασης δημιουργήθηκε με επιτυχία "{{file}}"',
  },
});
