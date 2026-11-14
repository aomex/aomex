import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  validator: {
    decimal128: {
      must_be_decimal128: '{{label}} divê ji tîpa Dehanî128 be',
    },
    objectId: {
      must_be_objectId: '{{label}} divê ji cureyê ObjectId be',
    },
  },
  mongoose: {
    unsupported_validator: '{{validator}} hîn nayê piştgirî kirin',
  },
  migration: {
    create: 'Pelê koçberiyê çêbikin',
    up: 'Koçberiyê pêk bînin',
    down: 'Koçberiya vegerê',
    file_not_found: 'Pelê koçberiyê "{{file}}" tune',
    input_file_name: 'Ji kerema xwe navê pelê koçberiyê binivîse:',
    file_created: 'Pelê koçê bi serkeftî "{{file}}" hate afirandin',
  },
});
