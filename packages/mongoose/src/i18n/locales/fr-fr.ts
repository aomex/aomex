import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fr-FR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} doit être de type Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} doit être de type ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Pas encore pris en charge {{validator}}',
  },
});
