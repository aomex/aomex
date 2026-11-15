import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}}:n on oltava tiedosto',
      too_large: '{{label}} -tiedosto on liian suuri',
      unsupported_mimetype: 'Tiedostotyyppiä {{label}} ei tueta',
      invalid_mimetype_token: 'Virheellinen mediatyyppi tai tiedostopääte: {{token}}',
    },
  },
  response: {
    redirect: 'Ohjataan osoitteeseen {{url}}',
  },
});
