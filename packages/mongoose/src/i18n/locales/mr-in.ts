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
  migration: {
    create: 'स्थलांतर फाइल तयार करा',
    up: 'स्थलांतर कार्यान्वित करा',
    down: 'रोलबॅक स्थलांतर',
    file_not_found: '"{{file}}" स्थलांतरण फाइल अस्तित्वात नाही',
    input_file_name: 'कृपया स्थलांतरण फाइल नाव प्रविष्ट करा:',
    file_created: 'स्थलांतरण फाइल "{{file}}" यशस्वीरित्या तयार केली गेली.',
  },
});
