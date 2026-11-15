import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} mora biti datoteka',
      too_large: '{{label}} datoteka je prevelika',
      unsupported_mimetype: 'Vrsta datoteke {{label}} nije podržana',
      invalid_mimetype_token: 'Nevažeća vrsta medija ili ekstenzija datoteke: {{token}}',
    },
  },
  response: {
    redirect: 'Preusmjeravanje na {{url}}',
  },
});
