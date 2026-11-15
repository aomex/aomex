import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Faýl bolmaly',
      too_large: '{{label}} Faýl gaty uly',
      unsupported_mimetype: '{{label}} faýl görnüşi goldanylmaýar',
      invalid_mimetype_token: 'Nädogry media görnüşi ýa-da faýl giňeltmesi: {{token}}',
    },
  },
  response: {
    redirect: '{{url}} sahypasyna gönükdirilýär',
  },
});
