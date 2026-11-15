import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} दशांश128 प्रकारातील असणे आवश्यक आहे',
    },
    objectId: {
      must_be_objectId: '{{label}} ObjectId प्रकारातील असणे आवश्यक आहे',
    },
  },
  mongoose: {
    unsupported_validator: 'अद्याप {{validator}} समर्थित नाही',
  },
});
