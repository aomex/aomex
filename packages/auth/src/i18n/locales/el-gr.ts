import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-gr */
export default I18n.satisfies(zh).define({
  session_create_failed:
    'Αδυναμία δημιουργίας συνεδρίας: απέτυχαν πολλαπλές προσπάθειες εγγραφής, ελέγξτε τον προσαρμογέα αποθήκευσης',
  session_max_age_invalid:
    'Το cookie.maxAge πρέπει να είναι θετικός αριθμός (σε δευτερόλεπτα)',
});
