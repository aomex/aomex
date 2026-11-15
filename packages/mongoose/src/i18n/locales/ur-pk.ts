import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Decimal128 قسم کا ہونا چاہیے۔',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId قسم کا ہونا چاہیے۔',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} ابھی تک تعاون یافتہ نہیں ہے۔',
  },
});
