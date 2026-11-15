import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bn-BD */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} Decimal128 টাইপের হতে হবে',
    },
    objectId: {
      must_be_objectId: '{{label}} টাইপের ObjectId হতে হবে',
    },
  },
  mongoose: {
    unsupported_validator: 'এখনও {{validator}} সমর্থিত নয়৷',
  },
});
