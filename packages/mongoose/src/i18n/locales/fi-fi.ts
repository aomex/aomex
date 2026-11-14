import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}}:n on oltava tyyppiä Decimal128',
    },
    objectId: {
      must_be_objectId: '{{label}}:n on oltava tyyppiä ObjectId',
    },
  },
  mongoose: {
    unsupported_validator: 'Ei vielä tuettu {{validator}}',
  },
  migration: {
    create: 'Luo siirtotiedosto',
    up: 'Suorita siirto',
    down: 'Siirron palautus',
    file_not_found: 'Siirtotiedostoa "{{file}}" ei ole olemassa',
    input_file_name: 'Anna siirtotiedoston nimi:',
    file_created: 'Siirtotiedosto luotiin onnistuneesti "{{file}}"',
  },
});
