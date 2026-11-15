import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} தசம128 வகையாக இருக்க வேண்டும்',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId வகையாக இருக்க வேண்டும்',
    },
  },
  mongoose: {
    unsupported_validator: 'இன்னும் {{validator}} ஆதரிக்கப்படவில்லை',
  },
});
