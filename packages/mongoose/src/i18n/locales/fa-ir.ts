import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} باید از نوع Decimal128 باشد',
    },
    objectId: {
      must_be_objectId: '{{label}} باید از نوع ObjectId باشد',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} هنوز پشتیبانی نمی شود',
  },
});
