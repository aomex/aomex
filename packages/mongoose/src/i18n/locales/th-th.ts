import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ต้องเป็นประเภท Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} ต้องเป็นประเภท ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'ยังไม่รองรับ {{validator}}',
  },
});
