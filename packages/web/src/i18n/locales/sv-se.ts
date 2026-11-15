import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} Måste vara en fil',
      too_large: '{{label}} Filen är för stor',
      unsupported_mimetype: 'Filtypen {{label}} stöds inte',
      invalid_mimetype_token: 'Ogiltig medietyp eller filändelse: {{token}}',
    },
  },
  response: {
    redirect: 'Omdirigerar till {{url}}',
  },
});
