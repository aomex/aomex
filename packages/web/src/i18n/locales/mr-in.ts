import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} फाइल असणे आवश्यक आहे',
      too_large: '{{label}} फाइल खूप मोठी आहे',
      unsupported_mimetype: 'फाइल प्रकार {{label}} समर्थित नाही',
    },
  },
  response: {
    redirect: '{{url}} कडे पुनर्निर्देशित करत आहे',
  },
});
