import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} phải thuộc loại Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} phải thuộc loại ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Chưa được hỗ trợ {{validator}}',
  },
});
