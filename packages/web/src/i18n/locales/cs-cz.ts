import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  validator: {
    file: {
      must_be_file: '{{label}} musí být soubor',
      too_large: 'Soubor {{label}} je příliš velký',
      unsupported_mimetype: 'Typ souboru {{label}} není podporován',
      invalid_mimetype_token: 'Neplatný typ média nebo přípona souboru: {{token}}',
    },
  },
  response: {
    redirect: 'Přesměrování na {{url}}',
  },
});
