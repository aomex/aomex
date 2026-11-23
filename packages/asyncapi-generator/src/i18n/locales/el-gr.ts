import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  initialize: 'έγγραφο προετοιμασίας',
  search_channels_files: 'αναζήτηση αρχείων Channel',
  parse_channels: 'ανάλυση Channels',
  hand_fix_documentation: 'Επισκευάστε έγγραφα με μη αυτόματο τρόπο',
  save_to_file: 'αποθήκευση στο αρχείο',
  validate: 'Επαλήθευση εγγράφου',
  help_summary: 'Γεννήτρια τεκμηρίωσης AsyncAPI 3',
  has_error: 'Σφάλματα {{error_count}}, προειδοποιήσεις {{warning_count}}',
  no_error: 'κανένα λάθη',
});
