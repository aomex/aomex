import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} moet een bestand zijn',
      too_large: '{{label}} -bestand is te groot',
      unsupported_mimetype: 'Het bestandstype {{label}} wordt niet ondersteund',
      invalid_mimetype_token: 'Ongeldig mediatype of bestandsextensie: {{token}}',
    },
  },
  response: {
    redirect: 'Doorverwijzen naar {{url}}',
  },
});
