import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ka-GE */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} უნდა იყოს Decimal128 ტიპის',
    },
    objectId: {
      must_be_objectId: '{{label}} უნდა იყოს ObjectId ტიპის',
    },
  },
  mongoose: {
    unsupported_validator: 'ჯერ არ არის მხარდაჭერილი {{validator}}',
  },
});
