import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} peab olema tüüp Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} peab olema tüübiga ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Pole veel toetatud. {{validator}}',
  },
});
