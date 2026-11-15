import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} verður að vera af gerðinni Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}} verður að vera af gerðinni ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ekki studd enn {{validator}}',
  },
});
