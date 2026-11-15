import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} ត្រូវតែជាប្រភេទ Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} ត្រូវតែជាប្រភេទ ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'មិនទាន់គាំទ្រ {{validator}} នៅឡើយទេ',
  },
});
