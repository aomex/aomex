import { I18n } from '@aomex/internal-tools';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  validator: {
    required: 'Απαιτείται {{label}}',
    array: {
      must_be_array: 'Το {{label}} πρέπει να είναι πίνακας',
      length_not_in_range:
        'Το μήκος του πίνακα {{label}} δεν είναι εντός του καθορισμένου εύρους',
      not_unique: 'Τα στοιχεία του πίνακα {{label}} δεν μπορούν να επαναληφθούν',
    },
    boolean: {
      must_be_boolean: 'Το {{label}} πρέπει να είναι μια Boolean τιμή',
    },
    buffer: {
      must_be_buffer: 'Το {{label}} πρέπει να είναι Buffer',
    },
    stream: {
      must_be_stream: 'Το {{label}} πρέπει να είναι Stream',
    },
    date: {
      must_be_date: 'Το {{label}} πρέπει να είναι ημερομηνία',
      not_in_range: 'Το {{label}} δεν βρίσκεται εντός του επιτρεπόμενου χρονικού εύρους',
    },
    number: {
      must_be_number: 'Το {{label}} πρέπει να είναι αριθμός',
      must_be_integer: 'Το {{label}} πρέπει να είναι ακέραιος',
      must_be_bigint: 'Το {{label}} πρέπει να είναι BigInt',
      not_in_range: 'Το {{label}} υπερβαίνει το επιτρεπόμενο εύρος τιμών',
    },
    string: {
      must_be_string: 'Το {{label}} πρέπει να είναι συμβολοσειρά',
      must_be_email: 'Το {{label}} πρέπει να είναι σε μορφή email',
      must_be_hash: 'Το {{label}} πρέπει να είναι σε μορφή κατακερματισμού',
      must_be_ip: 'Το {{label}} πρέπει να είναι διεύθυνση IP{{versions}}',
      must_be_ulid: 'Το {{label}} πρέπει να είναι σε μορφή ULID',
      must_be_uuid: 'Το {{label}} πρέπει να είναι σε μορφή UUID{{versions}}',
      length_not_in_range: 'Το μήκος {{label}} δεν πληροί τις απαιτήσεις',
      not_match_pattern: 'Το {{label}} δεν συμμορφώνεται με τους κανόνες',
    },
    object: {
      must_be_object: 'Το {{label}} πρέπει να είναι αντικείμενο',
    },
    enum: {
      not_in_range: 'Το {{label}} δεν βρίσκεται στο εύρος απαρίθμησης',
      only_support_string_number_boolean:
        'Οι τιμές απαρίθμησης μπορούν να είναι μόνο συμβολοσειρές, αριθμοί και τιμές Boolean',
      value_can_not_be_empty:
        'Η τιμή απαρίθμησης δεν μπορεί να είναι μηδενική τιμή "{{item}}"',
      ranges_can_not_be_empty: 'Το εύρος απαρίθμησης δεν μπορεί να είναι κενό',
      default_not_in_range:
        'Η προεπιλεγμένη τιμή "{{item}}" δεν βρίσκεται στο εύρος απαρίθμησης',
    },
    literal: {
      not_match: 'Το {{label}} δεν είναι η καθορισμένη τιμή',
      unsupported_value: 'Υποστηρίζει μόνο συμβολοσειρές, αριθμούς, booleans και null',
    },
    one_of: {
      not_match_rule: 'Το {{label}} δεν συμμορφώνεται με τους κανόνες',
      match_multiple_rule: 'Το {{label}} συμμορφώνεται με πολλούς κανόνες',
    },
    any_of: {
      not_match_rule: 'Το {{label}} δεν συμμορφώνεται με τους κανόνες',
    },
    all_of: {
      not_match_all: 'Το {{label}} δεν πληροί όλους τους κανόνες',
    },
    url: {
      must_be_url: 'Το {{label}} πρέπει να είναι σε μορφή URL',
      unsupported_scheme:
        'Το {{label}} περιέχει ένα πρωτόκολλο URL που δεν υποστηρίζεται: {{scheme}}',
    },
  },
});
