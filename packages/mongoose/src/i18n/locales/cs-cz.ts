import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} musí být typu Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} musí být typu ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Zatím není podporováno {{validator}}',
  },
});
