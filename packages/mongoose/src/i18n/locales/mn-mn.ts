import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Decimal128 төрлийн байх ёстой',
    },
    objectId: {
      must_be_objectId: '{{label}} нь ObjectId төрлийн байх ёстой',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} хараахан дэмжигдээгүй байна',
  },
});
