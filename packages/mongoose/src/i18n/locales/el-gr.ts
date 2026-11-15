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
});
