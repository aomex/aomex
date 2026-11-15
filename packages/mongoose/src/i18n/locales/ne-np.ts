import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} दशमलव128 प्रकारको हुनुपर्छ',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId प्रकारको हुनुपर्छ',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} अझै समर्थित छैन',
  },
});
