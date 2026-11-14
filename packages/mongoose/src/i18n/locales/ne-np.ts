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
  migration: {
    create: 'माइग्रेसन फाइल सिर्जना गर्नुहोस्',
    up: 'माइग्रेसन कार्यान्वयन गर्नुहोस्',
    down: 'रोलब्याक माइग्रेसन',
    file_not_found: 'माइग्रेसन फाइल "{{file}}" अवस्थित छैन',
    input_file_name: 'कृपया माइग्रेसन फाइल नाम प्रविष्ट गर्नुहोस्:',
    file_created: 'माइग्रेसन फाइल "{{file}}" सफलतापूर्वक सिर्जना गरियो।',
  },
});
