import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} skal være en fil',
      too_large: '{{label}} -filen er for stor',
      unsupported_mimetype: 'Filtypen {{label}} understøttes ikke',
      invalid_mimetype_token: 'Ugyldig medietype eller filendelse: {{token}}',
    },
  },
  response: {
    redirect: 'Omdirigerer til {{url}}',
  },
});
