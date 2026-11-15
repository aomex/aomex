import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} फाइल हुनुपर्छ',
      too_large: '{{label}} फाइल धेरै ठूलो छ',
      unsupported_mimetype: 'फाइल प्रकार {{label}} समर्थित छैन',
      invalid_mimetype_token: 'अमान्य मिडिया प्रकार वा फाइल एक्सटेन्सन: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} मा पुनःनिर्देशन गर्दै',
  },
});
