import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}, Decimal128 türünde olmalıdır',
    },
    objectId: {
      must_be_objectId: '{{label}}, ObjectId türünde olmalıdır',
    },
  },
  mongoose: {
    unsupported_validator: 'Henüz desteklenmiyor {{validator}}',
  },
});
