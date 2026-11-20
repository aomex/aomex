import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  credentials_without_origin:
    'όταν το credentials είναι true, το origin πρέπει να οριστεί ρητά (συγκεκριμένο origin, λίστα επιτρεπόμενων ή συνάρτηση που επιστρέφει συγκεκριμένο origin)· η προεπιλεγμένη αντανάκλαση δεν επιτρέπεται',
  credentials_with_wildcard_origin:
    'όταν το credentials είναι true, το origin δεν μπορεί να είναι "*": τα προγράμματα περιήγησης απορρίπτουν αυτόν τον συνδυασμό· χρησιμοποιήστε συγκεκριμένο origin, λίστα επιτρεπόμενων ή συνάρτηση που επιστρέφει συγκεκριμένο origin',
});
