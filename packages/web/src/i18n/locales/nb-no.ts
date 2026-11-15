import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} må være en fil',
      too_large: '{{label}} -filen er for stor',
      unsupported_mimetype: 'Filtypen {{label}} støttes ikke',
      invalid_mimetype_token: 'Ugyldig medietype eller filendelse: {{token}}',
    },
  },
  response: {
    redirect: 'Omdirigerer til {{url}}',
  },
});
