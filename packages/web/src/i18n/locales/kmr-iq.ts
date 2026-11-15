import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} divê pelek be',
      too_large: 'Pelê {{label}} pir mezin e',
      unsupported_mimetype: 'Cureya pelê {{label}} nayê destek kirin',
      invalid_mimetype_token: 'Cureya medyayê an pêveka pelê nederbasdar: {{token}}',
    },
  },
  response: {
    redirect: 'Ber bi {{url}} ve tê şandin',
  },
});
