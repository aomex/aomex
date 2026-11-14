import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: 'Το {{label}} πρέπει να είναι αρχείο',
      too_large: 'Το αρχείο {{label}} είναι πολύ μεγάλο',
      unsupported_mimetype: 'Ο τύπος αρχείου {{label}} δεν υποστηρίζεται',
    },
  },
  response: {
    redirect: 'Ανακατεύθυνση σε {{url}}',
  },
});
