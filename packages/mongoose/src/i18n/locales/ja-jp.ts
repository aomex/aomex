import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} は Decimal128 型でなければなりません',
    },
    objectId: {
      must_be_objectId: '{{label}} は ObjectId タイプである必要があります',
    },
  },
  mongoose: {
    unsupported_validator: 'まだサポートされていません {{validator}}',
  },
});
