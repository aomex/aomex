import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  initialize: 'έγγραφο προετοιμασίας',
  search_routers_files: 'Αναζήτηση αρχείων δρομολόγησης',
  parse_routers: 'ανάλυση διαδρομής',
  add_tag: 'Προσθήκη ετικέτας',
  hand_fix_documentation: 'Επισκευάστε έγγραφα με μη αυτόματο τρόπο',
  optimize_parameter: 'Παράμετροι βελτιστοποίησης',
  save_to_file: 'αποθήκευση στο αρχείο',
  validate: 'Επαλήθευση εγγράφου',
  help_summary: 'Πρόγραμμα δημιουργίας τεκμηρίωσης OpenAPI v3',
  has_error: 'Σφάλματα {{error_count}}, προειδοποιήσεις {{warning_count}}',
  no_error: 'κανένα λάθη',
});
