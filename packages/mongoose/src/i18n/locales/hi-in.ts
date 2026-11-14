import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} दशमलव128 प्रकार का होना चाहिए',
    },
    objectId: {
      must_be_objectId: '{{label}} ऑब्जेक्टआईडी प्रकार का होना चाहिए',
    },
  },
  mongoose: {
    unsupported_validator: 'अभी तक समर्थित नहीं है {{validator}}',
  },
  migration: {
    create: 'माइग्रेशन फ़ाइल बनाएं',
    up: 'माइग्रेशन निष्पादित करें',
    down: 'रोलबैक माइग्रेशन',
    file_not_found: 'माइग्रेशन फ़ाइल "{{file}}" मौजूद नहीं है',
    input_file_name: 'कृपया माइग्रेशन फ़ाइल नाम दर्ज करें:',
    file_created: 'माइग्रेशन फ़ाइल सफलतापूर्वक बनाई गई "{{file}}"',
  },
});
